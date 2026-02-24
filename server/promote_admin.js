const { User } = require('./models');
const { connectDB } = require('./database');

async function promoteAdmin() {
    try {
        await connectDB();
        const user = await User.findOne({ where: { email: 'nurullaci-ab107@code.edu.az' } });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log('✅ User nurullaci-ab107@code.edu.az promoted to admin');
        } else {
            console.log('❌ User not found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

promoteAdmin();
