const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    console.log('Testing MongoDB Connection with URI:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@'));
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000, // 15 seconds
        });
        console.log('SUCCESS: MongoDB Connected!');
        await mongoose.connection.close();
    } catch (err) {
        console.error('FAILED: MongoDB Connection Error:', err.message);
        console.error('Full Error Object:', JSON.stringify(err, null, 2));
    }
};

testConnection();
