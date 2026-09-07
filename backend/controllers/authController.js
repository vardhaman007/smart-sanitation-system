import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smart-sanitation-development-secret';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/User ID and password are required.'
      });
    }

    const result = await query(
      `SELECT id, name, email, role, phone, password_hash
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/User ID or password.'
      });
    }

    const user = result.rows[0];

    if (!['admin', 'worker'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Staff login is only available for Admin and Workers.'
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'This staff account has not been configured with a password yet.'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/User ID or password.'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
}

export default {
  login
};
