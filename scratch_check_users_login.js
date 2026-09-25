const { Client } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vasanthi_creations?schema=public';
  const client = new Client({ connectionString });
  await client.connect();

  console.log('=== Checking Admin Users in Railway DB ===');
  const u = await client.query(`SELECT id, email, "userType", "accountStatus", "passwordHash", "posPinHash" FROM users WHERE email LIKE '%admin%' OR "userType" != 'CUSTOMER'`);
  console.log(u.rows);

  await client.end();
}

main().catch(console.error);
