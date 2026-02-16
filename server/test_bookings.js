const axios = require('axios');

async function testBookings() {
    console.log('🔍 Testing Bookings Endpoint...\n');
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

        console.log('\n2️⃣ Fetching all bookings...');
        const res = await api.get('/bookings');
        console.log(`✅ Received ${res.data.length} bookings.`);
        if (res.data.length > 0) {
            console.log('Sample booking data:', JSON.stringify(res.data[0], null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testBookings();
