import bcrypt from 'bcryptjs';
import { query } from './connection.js';

const adminHash = '/ipmhhh6/WXLRvv.lOi1pK.ydH8ubWW';
const workerHash = '.yCEKICtQy0w9yC9Hzv3uNaSkMC7YWX3lbJWAY1OTN3rpeNZUAjS';

await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');

await query(
  'UPDATE users SET password_hash =  WHERE email = ',
  [adminHash, 'admin@municipal.gov.in']
);

await query(
  'UPDATE users SET password_hash =  WHERE email = ',
  [workerHash, 'team01@municipal.gov.in']
);

console.log('Staff passwords configured successfully.');
process.exit(0);
