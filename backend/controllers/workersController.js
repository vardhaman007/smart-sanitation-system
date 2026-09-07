import { query } from '../db/connection.js';

// GET /api/workers - Return all workers and active task counts
export async function getWorkers(req, res, next) {
  try {
    const result = await query(`
      SELECT 
        w.id,
        w.name,
        w.email,
        w.phone,
        w.role,
        w.created_at,
        COUNT(CASE WHEN t.status IN ('Assigned', 'In Progress') THEN 1 END) as active_tasks,
        COUNT(t.id) as total_tasks
      FROM users w
      LEFT JOIN tickets t ON t.assigned_worker_id = w.id
      WHERE w.role = 'worker'
      GROUP BY w.id
      ORDER BY w.id ASC
    `);

    const workers = result.rows.map(row => ({
      id: row.id,
      teamId: `TEAM-0${row.id}`,
      name: row.name,
      email: row.email,
      phone: row.phone,
      activeTasks: parseInt(row.active_tasks, 10) || 0,
      totalTasks: parseInt(row.total_tasks, 10) || 0
    }));

    res.json({
      success: true,
      count: workers.length,
      data: workers
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/workers/:id/tickets - Return tickets assigned to a particular worker
export async function getWorkerTickets(req, res, next) {
  try {
    const { id } = req.params;
    const workerId = parseInt(id, 10);

    const result = await query(
      `SELECT 
        t.*,
        c.name as citizen_name,
        c.phone as citizen_phone,
        c.email as citizen_email,
        w.name as worker_name
      FROM tickets t
      LEFT JOIN users c ON t.citizen_id = c.id
      LEFT JOIN users w ON t.assigned_worker_id = w.id
      WHERE t.assigned_worker_id = $1
      ORDER BY t.created_at DESC`,
      [workerId]
    );

    const tickets = result.rows.map(row => ({
      id: row.ticket_number || `SAN-${row.id}`,
      numeric_id: row.id,
      title: row.description ? (row.description.length > 60 ? row.description.substring(0, 60) + '...' : row.description) : `${row.issue_type} Issue`,
      issueType: row.issue_type,
      description: row.description,
      location: row.location,
      imageUrl: row.image_url,
      afterImageUrl: row.after_image_url,
      priority: row.priority,
      status: row.status,
      citizenId: row.citizen_id,
      reportedBy: row.citizen_name || 'Citizen',
      citizenPhone: row.citizen_phone,
      reportedDate: new Date(row.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      assignedWorker: row.worker_name,
      assignedWorkerId: `TEAM-0${row.assigned_worker_id}`,
      resolutionNotes: row.resolution_note
    }));

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getWorkers,
  getWorkerTickets
};
