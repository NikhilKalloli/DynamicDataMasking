const express = require('express');
const { executeQueryWithMasking } = require('../../dataAccess/src');

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const role = req.query.role || 'developer'; // Get role from query parameter, default to developer
        
        if (role !== 'admin' && role !== 'developer') {
            return res.status(400).json({ error: 'Invalid role. Must be either "admin" or "developer"' });
        }

        const query = 'SELECT * FROM users';
        const maskingConfig = [
            { columnName: 'email', maskType: 'email' },
            { columnName: 'phone_number', maskType: 'phone' },
            { columnName: 'credit_card', maskType: 'card' },
            { columnName: 'ssn', maskType: 'string' }
        ];

        const results = await executeQueryWithMasking(query, maskingConfig, [], role);
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});