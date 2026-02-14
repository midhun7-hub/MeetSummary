const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.path}`);
    next();
});

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
        });
        console.log('[Backend - DB] MongoDB Connected Successfully');
    } catch (error) {
        console.error(`[Backend - DB Error]: ${error.message}`);
        if (error.message.includes('timeout') || error.message.includes('MongooseServerSelectionError')) {
            console.error('TIP: This often happens if your IP address is not whitelisted in MongoDB Atlas.');
            console.error('Please visit https://cloud.mongodb.com/ and check "Network Access".');
        }
        process.exit(1);
    }
};

// Routes
const meetingRoutes = require('./routes/meetingRoutes');
app.use('/api/meetings', meetingRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('LuminaMeeting Backend is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[Backend - Server Error] ${err.stack}`);
    res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`[Backend - Server] Running on http://localhost:${PORT}`);
    });
};

startServer();
