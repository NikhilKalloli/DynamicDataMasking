const Client = require('pg').Client;
const CardMask = require('../../lib/maskService/CardMask');
const EmailMask = require('../../lib/maskService/EmailMask');
const PhoneMask = require('../../lib/maskService/PhoneMask');
const PasswordMask = require('../../lib/maskService/PasswordMask');
const StringMask = require('../../lib/maskService/StringMask');

// Define masking rules for different column types
const maskingRules = {
    email: (value) => EmailMask.maskEmail2(value),
    phone: (value) => PhoneMask.maskPhone(value),
    card: (value) => CardMask.maskCard(value),
    password: (value) => PasswordMask.maskPassword(value),
    string: (value) => StringMask.maskString(value)
};

/**
 * Execute a SQL query and apply data masking to specified columns
 * @param {string} query - SQL query to execute
 * @param {Array<{columnName: string, maskType: string}>} maskingConfig - Configuration for which columns to mask
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Masked query results
 */
async function executeQueryWithMasking(query, maskingConfig = [], params = []) {
    const client = new Client({
        user: 'admin',
        host: 'localhost',
        database: 'test_db',
        password: 'password123',
        port: 5432,
    });

    try {
        await client.connect();
        // Execute the query
        const result = await client.query(query, params);
        
        // If no masking config provided, return raw results
        if (!maskingConfig.length) {
            return result.rows;
        }

        // Apply masking to the results
        const maskedRows = result.rows.map(row => {
            const maskedRow = { ...row };
            
            maskingConfig.forEach(config => {
                if (maskedRow[config.columnName]) {
                    const maskFn = maskingRules[config.maskType];
                    maskedRow[config.columnName] = maskFn(maskedRow[config.columnName]);
                }
            });
            
            return maskedRow;
        });

        return maskedRows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        await client.end();
    }
}

module.exports = {
    executeQueryWithMasking
};

// Example usage:
/*
const query = 'SELECT * FROM users';
const maskingConfig = [
    { columnName: 'email', maskType: 'email' },
    { columnName: 'phone_number', maskType: 'phone' },
    { columnName: 'credit_card', maskType: 'card' }
];

executeQueryWithMasking(query, maskingConfig)
    .then(maskedResults => console.log(maskedResults))
    .catch(error => console.error(error));
*/