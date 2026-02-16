const axios = require('axios');

async function testRegister() {
    try {
        const email = `test_${Date.now()}@test.com`;
        console.log(`Testing registration with email: ${email}`);

        const response = await axios.post('http://localhost:5000/api/auth/register', {
            email: email,
            password: 'password123',
            name: 'Test User'
        });

        console.log('Registration Response Status:', response.status);
        console.log('Registration Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data.token) {
            console.log('Token received. Testing profile fetch...');
            const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${response.data.token}`
                }
            });
            console.log('Profile Response Status:', profileResponse.status);
            console.log('Profile Response Data:', JSON.stringify(profileResponse.data, null, 2));
        }
    } catch (error) {
        if (error.response) {
            console.error('Error Response Status:', error.response.status);
            console.error('Error Response Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testRegister();
