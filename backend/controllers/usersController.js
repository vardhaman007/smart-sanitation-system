import { query } from '../db/connection.js';

// GET /api/users - Return all users
export async function getUsers(req, res, next) {
  try {
    const { role } = req.query;
    let sql = `SELECT id, name, email, role, phone, created_at FROM users`;
    const params = [];

    if (role) {
      params.push(role);
      sql += ` WHERE role = $1`;
    }

    sql += ` ORDER BY id ASC`;
    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/users - Create a new user
export async function createUser(req, res, next) {
  try {
    const { name, email, role, phone } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name and role are required fields.'
      });
    }

    const validRoles = ['citizen', 'worker', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${validRoles.join(', ')}`
      });
    }

    const result = await query(
      `INSERT INTO users (name, email, role, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, phone, created_at`,
      [name, email || null, role, phone || null]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') { // unique violation
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }
    next(err);
  }
}

export default {
  getUsers,
  createUser
};
