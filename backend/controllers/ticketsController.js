import { query } from '../db/connection.js';
import { analyzeComplaint } from '../services/aiTriageService.js';

// Helper to format ticket row into clean API response
function formatTicketRow(row) {
  return {
    id: row.ticket_number || `SAN-${row.id}`,
    numeric_id: row.id,
    title: row.description ? (row.description.length > 60 ? row.description.substring(0, 60) + '...' : row.description) : `${row.issue_type} Issue`,
    issueType: row.issue_type,
    description: row.description,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    imageUrl: row.image_url,
    afterImageUrl: row.after_image_url,
    priority: row.priority,
    status: row.status,
    citizenId: row.citizen_id,
    reportedBy: row.citizen_name || 'Anonymous Citizen',
    citizenPhone: row.citizen_phone,
    contactEmail: row.citizen_email,
    reportedDate: new Date(row.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + new Date(row.created_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    zone: row.location.includes('Ward') ? row.location.match(/Ward\s*\d+/i)?.[0] || 'Municipal Ward' : 'Municipal Ward',
    assignedWorker: row.worker_name || null,
    assignedWorkerId: row.assigned_worker_id ? `TEAM-0${row.assigned_worker_id}` : null,
    workerNumericId: row.assigned_worker_id,
    resolutionNotes: row.resolution_note,

// AI Triage Results
aiReason: row.ai_reason,
aiRecommendedAction: row.ai_recommended_action,
aiScore: row.ai_score,

createdAt: row.created_at,
updatedAt: row.updated_at,
resolvedAt: row.resolved_at
  };
}

// 1. GET /api/tickets - Return all tickets
export async function getAllTickets(req, res, next) {
  try {
    const { status, priority, worker_id } = req.query;

    let sql = `
      SELECT 
        t.*,
        c.name as citizen_name,
        c.phone as citizen_phone,
        c.email as citizen_email,
        w.name as worker_name
      FROM tickets t
      LEFT JOIN users c ON t.citizen_id = c.id
      LEFT JOIN users w ON t.assigned_worker_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      params.push(status);
      sql += ` AND t.status = $${params.length}`;
    }

    if (priority && priority !== 'All') {
      params.push(priority);
      sql += ` AND t.priority = $${params.length}`;
    }

    if (worker_id) {
      params.push(parseInt(worker_id, 10));
      sql += ` AND t.assigned_worker_id = $${params.length}`;
    }

    sql += ` ORDER BY t.created_at DESC`;

    const result = await query(sql, params);
    const tickets = result.rows.map(formatTicketRow);

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    next(err);
  }
}

// 2. GET /api/tickets/:id - Return single ticket including full history
export async function getTicketById(req, res, next) {
  try {
    const { id } = req.params;

    // Check by numeric id or ticket_number (e.g. SAN-1001)
    const ticketResult = await query(
      `SELECT 
        t.*,
        c.name as citizen_name,
        c.phone as citizen_phone,
        c.email as citizen_email,
        w.name as worker_name
      FROM tickets t
      LEFT JOIN users c ON t.citizen_id = c.id
      LEFT JOIN users w ON t.assigned_worker_id = w.id
      WHERE t.id::text = $1 OR t.ticket_number = $1`,
      [id]
    );

    if (ticketResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID or number "${id}" was not found.`
      });
    }

    const ticket = formatTicketRow(ticketResult.rows[0]);

    // Fetch history
    const historyResult = await query(
      `SELECT * FROM ticket_history 
       WHERE ticket_id = $1 
       ORDER BY created_at ASC`,
      [ticketResult.rows[0].id]
    );

    ticket.history = historyResult.rows.map(h => ({
      id: h.id,
      time: new Date(h.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ', ' + new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      action: h.new_status ? `Status changed to ${h.new_status}` : (h.note || 'Ticket update'),
      actor: h.changed_by || 'System',
      note: h.note || `Transitioned from ${h.old_status || 'Initial'} to ${h.new_status}`
    }));

    res.json({
      success: true,
      data: ticket
    });
  } catch (err) {
    next(err);
  }
}

// 3. POST /api/tickets - Create a new ticket
export async function createTicket(req, res, next) {
  try {
    const {
      issue_type,
      description,
      location,
      latitude,
      longitude,
      priority = 'Medium',
      citizen_name,
      citizen_phone,
      citizen_email,
      image_url: bodyImageUrl
    } = req.body;

// AI-powered complaint analysis
const aiAnalysis = analyzeComplaint({
  description,
  issue_type,
  location
});

const detectedIssueType = aiAnalysis.category;
const detectedPriority = aiAnalysis.priority;

    // Validation
    if (!issue_type || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: issue_type, description, and location are required.'
      });
    }

    // Resolve Image URL: file upload takes precedence over body URL
    let imageUrl = bodyImageUrl || null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Find or create citizen user if name/phone provided
    let citizenId = null;
    if (citizen_name) {
      const userRes = await query(
        `SELECT id FROM users WHERE phone = $1 OR (email = $2 AND email IS NOT NULL) LIMIT 1`,
        [citizen_phone || null, citizen_email || null]
      );
      if (userRes.rowCount > 0) {
        citizenId = userRes.rows[0].id;
      } else {
        const newUserRes = await query(
          `INSERT INTO users (name, email, role, phone) 
           VALUES ($1, $2, 'citizen', $3) RETURNING id`,
          [citizen_name, citizen_email || null, citizen_phone || null]
        );
        citizenId = newUserRes.rows[0].id;
      }
    }

    // Generate sequential ticket number (SAN-xxxx)
    const maxNumberRes = await query(
      `SELECT ticket_number FROM tickets WHERE ticket_number LIKE 'SAN-%' ORDER BY id DESC LIMIT 1`
    );
    let nextNum = 1001;
    if (maxNumberRes.rowCount > 0) {
      const lastNum = parseInt(maxNumberRes.rows[0].ticket_number.replace('SAN-', ''), 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
    const ticketNumber = `SAN-${nextNum}`;

    // Insert ticket
    const insertRes = await query(
      `INSERT INTO tickets (
  ticket_number, issue_type, description, location,
  latitude, longitude, image_url, priority, status, citizen_id,
  ai_reason, ai_recommended_action, ai_score
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'New', $9, $10, $11, $12)
RETURNING *`,
    [
  ticketNumber,
  detectedIssueType,
  description,
  location,
  latitude ? parseFloat(latitude) : null,
  longitude ? parseFloat(longitude) : null,
  imageUrl,
  detectedPriority,
  citizenId,
  aiAnalysis.reason,
  aiAnalysis.recommendedAction,
  aiAnalysis.score
  ]
    );

    const newTicket = insertRes.rows[0];

    // Create initial history entry
    const actorName = citizen_name ? `${citizen_name} (Citizen)` : 'Citizen';
    await query(
      `INSERT INTO ticket_history (ticket_id, old_status, new_status, changed_by, note)
       VALUES ($1, NULL, 'New', $2, 'Grievance submitted via Citizen Portal.')`,
      [newTicket.id, actorName]
    );

    // Fetch the complete formatted ticket
    const formatted = formatTicketRow({
      ...newTicket,
      citizen_name,
      citizen_phone,
      citizen_email,
      worker_name: null
    });

    formatted.history = [{
      id: 1,
      time: 'Just now',
      action: 'Ticket created',
      actor: actorName,
      note: `Report registered with initial status 'New' and priority '${priority}'.`
    }];

    res.status(201).json({
      success: true,
      message: `Grievance #${ticketNumber} created successfully`,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
}

// 4. PATCH /api/tickets/:id - General update (priority, description, etc.)
export async function updateTicket(req, res, next) {
  try {
    const { id } = req.params;
    const { priority, description, location, changed_by = 'Administrator' } = req.body;

    const currentTicketRes = await query(
      `SELECT * FROM tickets WHERE id::text = $1 OR ticket_number = $1`,
      [id]
    );

    if (currentTicketRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket "${id}" not found.`
      });
    }

    const currentTicket = currentTicketRes.rows[0];

    // Priority change check
    if (priority && priority !== currentTicket.priority) {
      const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
        });
      }

      await query(
        `UPDATE tickets SET priority = $1, updated_at = NOW() WHERE id = $2`,
        [priority, currentTicket.id]
      );

      await query(
        `INSERT INTO ticket_history (ticket_id, old_status, new_status, changed_by, note)
         VALUES ($1, $2, $2, $3, $4)`,
        [
          currentTicket.id,
          currentTicket.status,
          changed_by,
          `Priority changed from ${currentTicket.priority} to ${priority}`
        ]
      );
    }

    if (description || location) {
      await query(
        `UPDATE tickets 
         SET description = COALESCE($1, description),
             location = COALESCE($2, location),
             updated_at = NOW()
         WHERE id = $3`,
        [description || null, location || null, currentTicket.id]
      );
    }

    res.json({
      success: true,
      message: `Ticket "${id}" updated successfully`
    });
  } catch (err) {
    next(err);
  }
}

// 5. PATCH /api/tickets/:id/assign - Assign a worker to a ticket
export async function assignWorker(req, res, next) {
  try {
    const { id } = req.params;
    const { worker_id, changed_by = 'Municipal Admin' } = req.body;

    if (!worker_id) {
      return res.status(400).json({
        success: false,
        message: 'worker_id is required'
      });
    }

    // Verify worker exists in database
    const workerRes = await query(
      `SELECT * FROM users WHERE id = $1 AND role = 'worker'`,
      [parseInt(worker_id, 10)]
    );

    if (workerRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Sanitation worker with ID ${worker_id} not found.`
      });
    }

    const worker = workerRes.rows[0];

    // Fetch ticket
    const ticketRes = await query(
      `SELECT * FROM tickets WHERE id::text = $1 OR ticket_number = $1`,
      [id]
    );

    if (ticketRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket "${id}" not found.`
      });
    }

    const ticket = ticketRes.rows[0];
    const oldStatus = ticket.status;
    const newStatus = oldStatus === 'New' ? 'Assigned' : oldStatus;

    // Update assignment and status
    await query(
      `UPDATE tickets 
       SET assigned_worker_id = $1,
           status = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [worker.id, newStatus, ticket.id]
    );

    // Record in history
    await query(
      `INSERT INTO ticket_history (ticket_id, old_status, new_status, changed_by, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        ticket.id,
        oldStatus,
        newStatus,
        changed_by,
        `Assigned to ${worker.name}. Status updated to '${newStatus}'.`
      ]
    );

    res.json({
      success: true,
      message: `Ticket assigned to ${worker.name} successfully`,
      data: {
        ticketId: ticket.ticket_number,
        assignedWorker: worker.name,
        status: newStatus
      }
    });
  } catch (err) {
    next(err);
  }
}

// 6. PATCH /api/tickets/:id/status - Update status (In Progress, Resolved, Closed, Reopened)
export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note, changed_by = 'Worker / Admin', resolution_note } = req.body;

    const validStatuses = ['New', 'Assigned', 'In Progress', 'Resolved', 'Reopened', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Check ticket
    const ticketRes = await query(
      `SELECT * FROM tickets WHERE id::text = $1 OR ticket_number = $1`,
      [id]
    );

    if (ticketRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket "${id}" not found.`
      });
    }

    const ticket = ticketRes.rows[0];
    const oldStatus = ticket.status;

    // Check after-cleaning photo if uploaded via multer
    let afterImageUrl = req.body.after_image_url || null;
    if (req.file) {
      afterImageUrl = `/uploads/${req.file.filename}`;
    }

    const finalResolutionNote = resolution_note || note || null;
    const resolvedAt = status === 'Resolved' ? 'NOW()' : (status === 'Reopened' ? 'NULL' : 'resolved_at');

    await query(
      `UPDATE tickets 
       SET status = $1,
           resolution_note = COALESCE($2, resolution_note),
           after_image_url = COALESCE($3, after_image_url),
           resolved_at = ${status === 'Resolved' ? 'NOW()' : (status === 'Reopened' ? 'NULL' : 'resolved_at')},
           updated_at = NOW()
       WHERE id = $4`,
      [status, finalResolutionNote, afterImageUrl, ticket.id]
    );

    // Record in history
    const historyNote = finalResolutionNote 
      ? `${finalResolutionNote}${afterImageUrl ? ' (After-cleaning photo uploaded)' : ''}`
      : `Status changed from '${oldStatus}' to '${status}'.`;

    await query(
      `INSERT INTO ticket_history (ticket_id, old_status, new_status, changed_by, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [ticket.id, oldStatus, status, changed_by, historyNote]
    );

    res.json({
      success: true,
      message: `Status updated to '${status}' successfully`,
      data: {
        ticketId: ticket.ticket_number,
        oldStatus,
        newStatus: status,
        afterImageUrl,
        resolutionNote: finalResolutionNote
      }
    });
  } catch (err) {
    next(err);
  }
}

// 7. DELETE /api/tickets/:id - Delete ticket
export async function deleteTicket(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      `DELETE FROM tickets WHERE id::text = $1 OR ticket_number = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Ticket "${id}" not found.`
      });
    }

    res.json({
      success: true,
      message: `Ticket "${id}" deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  assignWorker,
  updateStatus,
  deleteTicket
};
