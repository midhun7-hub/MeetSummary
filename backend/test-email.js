const nodemailer = require('nodemailer');
require('dotenv').config();

const testConnection = async () => {
    console.log('Testing Email Configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not Set');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set');

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        family: 4
    });

    try {
        console.log('Verifying transporter...');
        await transporter.verify();
        console.log('✅ Connection success! The configuration is valid.');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        if (error.code === 'EAUTH') {
            console.log('\nTip: Check if your App Password is correct.');
        } else if (error.code === 'ESOCKET') {
            console.log('\nTip: This might be a network or firewall issue.');
        }
    }
};

testConnection();
