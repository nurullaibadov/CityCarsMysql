const { sequelize } = require('./database');
const { User } = require('./models');

async function checkDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Describe the Users table
        const [results, metadata] = await sequelize.query('DESCRIBE Users');
        console.log('Users Table Description:', results);

        // Check existing users
        const userCount = await User.count();
        console.log('Total Users:', userCount);

        if (userCount > 0) {
            const firstUser = await User.findOne();
            console.log('First User ID:', firstUser.id, typeof firstUser.id);
        }

        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

checkDb();
