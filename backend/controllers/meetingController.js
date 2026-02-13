const Meeting = require('../models/Meeting');
const { uploadAudio, transcribeAudio } = require('../services/transcriptionService');
const { generateSummary } = require('../services/summarizationService');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Step 1: Upload audio and Get Transcript
// @route   POST /api/meetings/transcribe
// @access  Public (Can remain public or be protected)
const transcribeMeeting = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file uploaded' });
        }

        const filePath = req.file.path;
        console.log(`[Backend - Controller] Processing audio file: ${filePath}`);

        // 1. Upload to AssemblyAI
        const audioUrl = await uploadAudio(filePath);

        // 2. Transcribe
        const transcriptText = await transcribeAudio(audioUrl);

        // Cleanup local file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Return transcript immediately
        res.json({ transcript: transcriptText });

    } catch (error) {
        console.error(`[Backend - Controller] Transcribe Error: ${error.message}`);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Step 2: Generate Summary and Save (With Multimodal & Optional Audio Support)
// @route   POST /api/meetings/summarize
// @access  Private
const summarizeMeeting = async (req, res) => {
    try {
        const { transcript, userNotes, images } = req.body;

        // At least one input source should be present
        if (!transcript && !userNotes && (!req.files || req.files.length === 0) && (!images || images.length === 0)) {
            return res.status(400).json({ message: 'Meeting data (transcript, notes, or files) is required' });
        }

        let imageUrls = [];

        // If files are uploaded (images or PDFs)
        if (req.files && req.files.length > 0) {
            console.log(`[Backend - Controller] Uploading ${req.files.length} files to Cloudinary...`);
            for (const file of req.files) {
                // Cloudinary upload with auto-detection for PDFs
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'meeting_summarizer_files',
                    resource_type: 'auto'
                });
                imageUrls.push(result.secure_url);
                // Cleanup local
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        } else if (images && Array.isArray(images)) {
            imageUrls = images;
        }

        // 3. Summarize (Gemini Multimodal)
        console.log('[Backend - Controller] Generating Multimodal Summary (Optional Audio)...');
        const summaryText = await generateSummary(transcript || '', userNotes || '', imageUrls);

        // 4. Extract Title
        const titleMatch = summaryText.match(/Main Heading:\s*(.*)/);
        const meetingTitle = titleMatch ? titleMatch[1].trim() : 'New Meeting';

        // 5. Save to DB with User ID
        const newMeeting = new Meeting({
            user: req.user.id,
            title: meetingTitle,
            transcript: transcript,
            userNotes: userNotes || '',
            imageUrls: imageUrls,
            summary: summaryText
        });

        await newMeeting.save();
        console.log(`[Backend - Controller] Meeting saved with ID: ${newMeeting._id} for User: ${req.user.id}`);

        res.status(201).json(newMeeting);

    } catch (error) {
        console.error(`[Backend - Controller] Summarize Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user meetings
// @route   GET /api/meetings
// @access  Private
const getMeetings = async (req, res) => {
    try {
        // Find meetings for the specific user
        const meetings = await Meeting.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single meeting
// @route   GET /api/meetings/:id
// @access  Private
const getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the meeting user
        if (meeting.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    transcribeMeeting,
    summarizeMeeting,
    getMeetings,
    getMeetingById
};
