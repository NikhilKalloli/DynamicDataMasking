const express = require('express');
const { executeQueryWithMasking } = require('../../dataAccess/src');

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const maskingConfig = [
            { columnName: 'email', maskType: 'email' },
            { columnName: 'phone_number', maskType: 'phone' },
            { columnName: 'credit_card', maskType: 'card' }
        ];

        const maskedResults = await executeQueryWithMasking(query, maskingConfig);
        res.json(maskedResults);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});