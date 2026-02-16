const axios = require('axios');
require('dotenv').config();

async function testLogin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@citycars.az';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.error('Error: ADMIN_PASSWORD not found in .env');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: adminEmail,
            password: adminPassword
        });
        console.log('Login Success:', response.data.user.email);
        console.log('Token Received:', !!response.data.token);
    } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error.message);
    }
}

testLogin();
