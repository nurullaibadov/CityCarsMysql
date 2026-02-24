const { Client } = require('pg');
require('dotenv').config();

const config = process.env.DATABASE_URL || {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'citycars_db'
};

async function check() {
    console.log(`🔍 Testing connection to PostgreSQL...`);

    // For Render/External PostgreSql we usually need SSL
    const client = new Client(typeof config === 'string' ? {
        connectionString: config,
        ssl: { rejectUnauthorized: false }
    } : {
        ...config,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ EXCELLENT! Connected successfully to PostgreSQL.');
        const res = await client.query('SELECT current_database(), current_user');
        console.log('📊 Stats:', res.rows[0]);
    } catch (err) {
        console.log('❌ FAILED:', err.message);
        console.log('\n🔧 HOW TO FIX:');
        console.log('1. Make sure your PostgreSQL Server is accessible.');
        console.log('2. Check if the credentials in .env are correct.');
        console.log('3. Ensure DATABASE_URL is correct if you are using it.');
    } finally {
        await client.end().catch(() => { });
        process.exit();
    }
}

check();
