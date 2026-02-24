const axios = require('axios');
require('dotenv').config();

async function testAdminStats() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@citycars.az';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Vaqif1988@';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    try {
        console.log(`🔑 Logging in as ${adminEmail}...`);
        const loginRes = await axios.post(`${backendUrl}/api/auth/login`, {
            email: adminEmail,
            password: adminPassword
        });

        const token = loginRes.data.token;
        console.log('✅ Logged in successfully.');

        console.log('\n📊 Fetching admin stats...');
        const statsRes = await axios.get(`${backendUrl}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Stats received:', statsRes.data);

        console.log('\n📈 Fetching revenue data...');
        const revenueRes = await axios.get(`${backendUrl}/api/admin/revenue`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Revenue data received:', revenueRes.data);

        console.log('\n📅 Fetching analytics...');
        const analyticsRes = await axios.get(`${backendUrl}/api/admin/analytics`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Analytics data received:', analyticsRes.data);

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

testAdminStats();
