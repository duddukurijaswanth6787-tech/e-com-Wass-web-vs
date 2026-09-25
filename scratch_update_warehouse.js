const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vasanthi_creations?schema=public',
});

async function main() {
  await client.connect();
  await client.query(`
    UPDATE warehouses 
    SET 
      address = 'Plot No. 42, Road No. 36, Jubilee Hills',
      "postalCode" = '500033',
      phone = '+91 98765 43210',
      "contactPerson" = 'Store Dispatch Manager',
      email = 'contact@vasanthicreations.in',
      "updatedAt" = NOW()
    WHERE id = 'b9e39ab4-10c9-4e64-a58a-d34ac87022fd'
  `);
  const res = await client.query('SELECT * FROM warehouses');
  console.log('Successfully updated warehouse:\n', JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(console.error);
