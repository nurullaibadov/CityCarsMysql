const axios = require('axios');

async function testDashboardStats() {
    console.log('🔍 Testing Dashboard Stats Endpoints...\n');
    const baseURL = 'http://localhost:5000/api';

    try {
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'admin@citycars.az',
            password: 'Vaqif1988@'
        });
        const token = loginResponse.data.token;
        console.log('✅ Login successful!');

        const api = axios.create({
            baseURL,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('\n2️⃣ Testing /admin/analytics (Weekly)...');
        const analyticsRes = await api.get('/admin/analytics');
        console.log(`✅ Received ${analyticsRes.data.length} days of data.`);
        console.log('Sample:', JSON.stringify(analyticsRes.data[0]));

        console.log('\n3️⃣ Testing /admin/stats/car-types...');
        const carTypesRes = await api.get('/admin/stats/car-types');
        console.log(`✅ Received ${carTypesRes.data.length} car types.`);
        console.log('Sample:', JSON.stringify(carTypesRes.data[0]));

        console.log('\n4️⃣ Testing /admin/stats/status-distribution...');
        const statusRes = await api.get('/admin/stats/status-distribution');
        console.log(`✅ Received ${statusRes.data.length} statuses.`);
        console.log('Sample:', JSON.stringify(statusRes.data[0]));

        console.log('\n5️⃣ Testing /admin/stats/user-growth...');
        const growthRes = await api.get('/admin/stats/user-growth');
        console.log(`✅ Received ${growthRes.data.length} months of data.`);
        console.log('Sample:', JSON.stringify(growthRes.data[0]));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testDashboardStats();
