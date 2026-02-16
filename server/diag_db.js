const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '2005',
    port: process.env.DB_PORT || 3306
};

async function check() {
    console.log(`🔍 Testing connection to MySQL on ${config.host}...`);
    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ EXCELLENT! Connected successfully to MySQL.');
        await connection.end();
    } catch (err) {
        console.log('❌ FAILED:', err.message);
        console.log('\n🔧 HOW TO FIX:');
        console.log('1. Make sure MySQL Server is running.');
        console.log('2. Check if the password "2005" is correct for user "root".');
    } finally {
        process.exit();
    }
}

check();
