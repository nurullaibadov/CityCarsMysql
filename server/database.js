const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize(
        process.env.DB_NAME || 'citycars_db',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASS || 'password',
        {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );

// Safely add new columns
async function runMigrations() {
    const qi = sequelize.getQueryInterface();
    const tableName = 'Bookings';

    try {
        const tableDesc = await qi.describeTable(tableName);

        if (!tableDesc.paymentStatus) {
            await qi.addColumn(tableName, 'paymentStatus', {
                type: Sequelize.STRING,
                defaultValue: 'pending'
            });
            console.log('  ➕ Added column: paymentStatus');
        }

        if (!tableDesc.stripePaymentIntentId) {
            await qi.addColumn(tableName, 'stripePaymentIntentId', {
                type: Sequelize.STRING,
                allowNull: true
            });
            console.log('  ➕ Added column: stripePaymentIntentId');
        }

        console.log('✅ Migrations complete.');
    } catch (err) {
        console.log('ℹ️  Skipping migrations (table may not exist yet or error occurred).');
    }
}

const connectDB = async () => {
    try {
        console.log('🔄 Connecting to PostgreSQL (Render)...');
        await sequelize.authenticate();
        console.log('✅ Success! Website is now connected to PostgreSQL.');

        // Sync models
        await sequelize.sync({ alter: false });
        console.log('✅ PostgreSQL Tables are synchronized.');

        // Run manual migrations for new columns
        await runMigrations();
    } catch (error) {
        console.error('❌ PostgreSQL Connection Error:', error.message);
        console.log('\n🛑 ACTION REQUIRED TO FIX THIS:');
        console.log('1. Check if the DATABASE_URL in .env is correct.');
        console.log('2. Ensure pg and pg-hstore packages are installed.');
        console.log('3. Ensure your IP has access if required (Render usually allows all for external URLs).');
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };

