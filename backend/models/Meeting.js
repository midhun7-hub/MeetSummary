const mongoose = require('mongoose');

// Define the Meeting Schema
const meetingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'Untitled Meeting',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    transcript: {
        type: String,
        required: false, // Transcript might be empty initially or if failed
    },
    userNotes: {
        type: String,
        required: false,
    },
    imageUrls: {
        type: [String],
        default: [],
    },
    summary: {
        type: String, // Storing the formatted AI summary
        required: false,
    },
    // We might want to store the structured parts separately later, but a string is flexible for now
    // adhering to "Save result (Title, Date, Summary) to MongoDB"
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Meeting', meetingSchema);
