const { Client } = require('pg');

const client = new Client({
    user: 'admin',
    host: 'localhost',
    database: 'test_db',
    password: 'password123',
    port: 5432,
});

// docker run --name local-postgres \
//   -e POSTGRES_USER=admin \
//   -e POSTGRES_PASSWORD=password123 \
//   -e POSTGRES_DB=test_db \
//   -p 5432:5432 \
//   -d postgres

client.on('error', (err) => {
    console.log('Database error:', err);
});

client.on('connect', () => {
    console.log('Successfully connected to database');
});

// Sample data to seed
const users = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        credit_card: '4111111111111111',
        ssn: '123-45-6789',
        department: 'IT'
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone_number: '+1987654321',
        credit_card: '5555555555554444',
        ssn: '987-65-4321',
        department: 'HR'
    },
    {
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        phone_number: '+1122334455',
        credit_card: '3782822463100005',
        ssn: '456-78-9012',
        department: 'Finance'
    }
];

async function createTable() {
    try {
        await client.connect();
        await client.query(`
            DROP TABLE IF EXISTS users;
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100),
                phone_number VARCHAR(20),
                credit_card VARCHAR(20),
                ssn VARCHAR(12),
                department VARCHAR(50)
            );
        `);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    }
}

async function seedData() {
    try {
        // Create table first
        await createTable();

        // Insert users
        for (const user of users) {
            await client.query(`
                INSERT INTO users (name, email, phone_number, credit_card, ssn, department)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [user.name, user.email, user.phone_number, user.credit_card, user.ssn, user.department]);
        }

        console.log('Data seeded successfully');

        // Test query to verify
        const result = await client.query('SELECT * FROM users');
        console.log('Seeded data:', result.rows);

    } catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    } finally {
        // Close the client connection
        await client.end();
    }
}

// Run the seeding
seedData()
    .then(() => console.log('Seeding completed'))
    .catch(error => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
