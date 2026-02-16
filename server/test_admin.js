const axios = require('axios');

async function testAdminEndpoints() {
    console.log('🔍 Testing Admin Panel Endpoints...\n');

    const baseURL = 'http://localhost:5000/api';

    try {
        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'admin@citycars.az',
            password: 'Vaqif1988@'
        });

        const token = loginResponse.data.token;
        console.log('✅ Login successful! Token received.');

        // Create axios instance with auth
        const api = axios.create({
            baseURL,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Step 2: Test admin stats
        console.log('\n2️⃣ Testing /admin/stats...');
        const statsResponse = await api.get('/admin/stats');
        console.log('✅ Stats:', JSON.stringify(statsResponse.data, null, 2));

        // Step 3: Test admin analytics
        console.log('\n3️⃣ Testing /admin/analytics...');
        const analyticsResponse = await api.get('/admin/analytics');
        console.log(`✅ Analytics: ${analyticsResponse.data.length} days of data`);

        // Step 4: Test admin activities
        console.log('\n4️⃣ Testing /admin/activities...');
        const activitiesResponse = await api.get('/admin/activities?limit=5');
        console.log(`✅ Activities: ${activitiesResponse.data.length} recent activities`);

        // Step 5: Test top vehicles
        console.log('\n5️⃣ Testing /admin/top-vehicles...');
        const vehiclesResponse = await api.get('/admin/top-vehicles');
        console.log(`✅ Top Vehicles: ${vehiclesResponse.data.length} vehicles`);

        // Step 6: Test revenue
        console.log('\n6️⃣ Testing /admin/revenue...');
        const revenueResponse = await api.get('/admin/revenue');
        console.log(`✅ Revenue: Total $${revenueResponse.data.total || 0}`);

        console.log('\n✅ ALL ADMIN ENDPOINTS WORKING!');
        console.log('\n📋 Summary:');
        console.log('   - Admin login: ✅');
        console.log('   - Dashboard stats: ✅');
        console.log('   - Analytics charts: ✅');
        console.log('   - Recent activities: ✅');
        console.log('   - Top vehicles: ✅');
        console.log('   - Revenue data: ✅');
        console.log('\n🎉 Admin panel is fully functional!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testAdminEndpoints();
