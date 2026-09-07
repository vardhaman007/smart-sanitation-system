import { query } from '../db/connection.js';

// GET /api/stats - Compute live dashboard counts from PostgreSQL
export async function getDashboardStats(req, res, next) {
  try {
    const { worker_id } = req.query;

    let filterClause = '';
    const params = [];
    if (worker_id) {
      params.push(parseInt(worker_id, 10));
      filterClause = ` WHERE assigned_worker_id = $1`;
    }

    const statsRes = await query(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'New' THEN 1 END) as new_tickets,
        COUNT(CASE WHEN status = 'Assigned' THEN 1 END) as assigned_tickets,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed_tickets,
        COUNT(CASE WHEN status = 'Reopened' THEN 1 END) as reopened_tickets,
        COUNT(CASE WHEN priority IN ('High', 'Critical') THEN 1 END) as high_critical_tickets,
        COUNT(CASE WHEN priority = 'Critical' THEN 1 END) as critical_tickets,
        COUNT(CASE WHEN priority = 'High' THEN 1 END) as high_tickets,
        COUNT(CASE WHEN priority = 'Medium' THEN 1 END) as medium_tickets,
        COUNT(CASE WHEN priority = 'Low' THEN 1 END) as low_tickets
      FROM tickets
      ${filterClause}
    `, params);

    const row = statsRes.rows[0];

    res.json({
      success: true,
      data: {
        totalTickets: parseInt(row.total_tickets, 10) || 0,
        newTickets: parseInt(row.new_tickets, 10) || 0,
        assignedTickets: parseInt(row.assigned_tickets, 10) || 0,
        inProgressTickets: parseInt(row.in_progress_tickets, 10) || 0,
        resolvedTickets: parseInt(row.resolved_tickets, 10) || 0,
        closedTickets: parseInt(row.closed_tickets, 10) || 0,
        reopenedTickets: parseInt(row.reopened_tickets, 10) || 0,
        highCriticalTickets: parseInt(row.high_critical_tickets, 10) || 0,
        criticalTickets: parseInt(row.critical_tickets, 10) || 0,
        highTickets: parseInt(row.high_tickets, 10) || 0,
        mediumTickets: parseInt(row.medium_tickets, 10) || 0,
        lowTickets: parseInt(row.low_tickets, 10) || 0
      }
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getDashboardStats
};
