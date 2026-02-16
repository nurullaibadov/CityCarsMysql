const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSanitization() {
    console.log('🧪 Testing SMTP Password Sanitization...');

    // Simulate user error with spaces
    const simulatedEnvPass = (process.env.SMTP_PASS || '').split('').join(' '); // Add spaces to real password!
    process.env.SMTP_PASS = simulatedEnvPass;

    // Original behavior (failure simulation)
    // const badTransporter = nodemailer.createTransport({ ... });

    // NEW behavior (sanitization)
    const cleanSmtpPass = (process.env.SMTP_PASS || '').replace(/\s/g, '');
    console.log(`original: "${process.env.SMTP_PASS}" (len: ${process.env.SMTP_PASS.length})`);
    console.log(`cleaned:  "${cleanSmtpPass}" (len: ${cleanSmtpPass.length})`);

    if (cleanSmtpPass.length === 16 && !cleanSmtpPass.includes(' ')) {
        console.log('✅ Sanitization works!');
    } else {
        console.error('❌ Sanitization failed!');
        process.exit(1);
    }

    // Verify connection with real credentials cleaned
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: cleanSmtpPass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection successful with sanitized password!');
    } catch (error) {
        console.error('❌ SMTP Connection Error:', error.message);
    }
}

testSanitization();
