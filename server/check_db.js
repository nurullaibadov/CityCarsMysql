const { connectDB } = require('./database');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        await connectDB();
        const users = await User.findAll();
        console.log('--- Current Users in DB ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Role: ${u.role}`);
        });
        console.log('---------------------------');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUsers();
