import { query } from "./db/connection.js";

const result = await query(
  "SELECT ticket_number, issue_type, priority, ai_reason, ai_recommended_action, ai_score FROM tickets WHERE ticket_number = $1",
  ["SAN-1008"]
);

console.log(result.rows);
process.exit(0);
