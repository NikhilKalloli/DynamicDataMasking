const { Client } = require('pg');

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'test_db',
  password: 'password123',
  port: 5432,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL');
    
    const res = await client.query('SELECT NOW()');
    console.log('PostgreSQL timestamp:', res.rows[0]);
    
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();