const axios = require('axios');

async function testForgotPassword() {
    try {
        const email = 'ibadnurulla@gmail.com'; // Use an existing email from the database
        console.log(`Testing forgot-password for email: ${email}`);

        const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
            email: email
        });

        console.log('Forgot Password Response Status:', response.status);
        console.log('Forgot Password Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.error('Error Response Status:', error.response.status);
            console.error('Error Response Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testForgotPassword();
