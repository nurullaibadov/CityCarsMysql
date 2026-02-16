const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '2005',
    port: process.env.DB_PORT || 3306
};

const targetDb = process.env.DB_NAME || 'citycars_db';

async function ensureDatabaseExists() {
    try {
        console.log(`🔍 Checking if database "${targetDb}" exists on MySQL...`);
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${targetDb}\`;`);
        await connection.end();
        console.log(`✅ Database "${targetDb}" is verified/created.`);
    } catch (err) {
        console.error('❌ Database Creation Check Failed:', err.message);
        console.log('💡 Ensure MySQL is running and your credentials are correct.');
    }
}

const sequelize = new Sequelize(
    targetDb,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await ensureDatabaseExists();

        console.log('🔄 Connecting to MySQL...');
        await sequelize.authenticate();
        console.log('✅ Success! Website is now connected to MySQL.');

        // Sync models
        await sequelize.sync({ alter: false });
        console.log('✅ MySQL Tables are synchronized.');
    } catch (error) {
        console.error('❌ MySQL Connection Error:', error.message);
        console.log('\n🛑 ACTION REQUIRED TO FIX THIS:');
        console.log('1. Ensure MySQL Server is running.');
        console.log('2. Check if the password "2005" is correct for user "root".');
        console.log('3. Ensure the port 3306 is open.');
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
