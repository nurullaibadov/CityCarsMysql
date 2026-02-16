const axios = require('axios');

async function testConnection() {
    console.log('🔍 Testing Frontend-Backend Connection...\n');

    try {
        // Test 1: Backend root
        console.log('1️⃣ Testing Backend Root (http://localhost:5000)...');
        const rootResponse = await axios.get('http://localhost:5000');
        console.log('✅ Backend Root:', rootResponse.data);

        // Test 2: Cars API
        console.log('\n2️⃣ Testing Cars API (http://localhost:5000/api/cars)...');
        const carsResponse = await axios.get('http://localhost:5000/api/cars');
        console.log(`✅ Cars API: Found ${carsResponse.data.length} cars`);
        console.log('   Cars:', carsResponse.data.map(c => c.name).join(', '));

        // Test 3: Drivers API
        console.log('\n3️⃣ Testing Drivers API (http://localhost:5000/api/drivers)...');
        const driversResponse = await axios.get('http://localhost:5000/api/drivers');
        console.log(`✅ Drivers API: Found ${driversResponse.data.length} drivers`);
        console.log('   Drivers:', driversResponse.data.map(d => d.name).join(', '));

        console.log('\n✅ ALL TESTS PASSED! Backend is working correctly.');
        console.log('\n📋 Summary:');
        console.log('   - Backend URL: http://localhost:5000');
        console.log('   - Frontend URL: http://localhost:8081');
        console.log('   - Database: MySQL (citycars_db)');
        console.log('   - CORS: Enabled for localhost:8081');
        console.log('\n🎉 Your website should now be working!');
        console.log('   Open http://localhost:8081 in your browser to see it.');

    } catch (error) {
        console.error('❌ Connection Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testConnection();
