const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
    console.log('🔍 Testing SMTP Configuration...\n');

    console.log('Configuration:');
    console.log('- Host:', process.env.SMTP_HOST);
    console.log('- Port:', process.env.SMTP_PORT);
    console.log('- User:', process.env.SMTP_USER);
    console.log('- Pass:', process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
    console.log('');

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Test connection
    try {
        console.log('📡 Testing connection...');
        await transporter.verify();
        console.log('✅ SMTP Connection successful!\n');

        // Send a test email
        console.log('📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `"CityCars.az Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'SMTP Test - CityCars.az',
            text: 'If you receive this email, your SMTP configuration is working correctly!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff3b3b;">✅ SMTP Test Successful!</h2>
                    <p>Your SMTP configuration for CityCars.az is working correctly.</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                    <hr/>
                    <p style="color: #666; font-size: 12px;">This is an automated test email from your CityCars.az backend server.</p>
                </div>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('\n🎉 All SMTP tests passed! Check your inbox:', process.env.SMTP_USER);
    } catch (error) {
        console.error('❌ SMTP Error:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('1. Make sure you are using a Gmail App Password, not your regular password');
        console.error('2. Enable 2-factor authentication in your Google account');
        console.error('3. Generate an app password at: https://myaccount.google.com/apppasswords');
        console.error('4. The app password should be 16 characters without spaces');
        console.error('5. Make sure "Less secure app access" is not required (App passwords are more secure)');
    }
}

testSMTP();
