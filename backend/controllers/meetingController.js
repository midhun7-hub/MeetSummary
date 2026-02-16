const Meeting = require('../models/Meeting');
const { uploadAudio, transcribeAudio } = require('../services/transcriptionService');
const { generateSummary } = require('../services/summarizationService');
const { sendSummaryEmail } = require('../services/emailService');
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
    let localPaths = [];
    try {
        const { transcript, userNotes, images } = req.body;

        // At least one input source should be present
        if (!transcript && !userNotes && (!req.files || req.files.length === 0) && (!images || images.length === 0)) {
            return res.status(400).json({ message: 'Meeting data (transcript, notes, or files) is required' });
        }

        let imageUrls = [];

        // If files are uploaded (images or PDFs)
        if (req.files && req.files.length > 0) {
            localPaths = req.files.map(f => f.path);
            console.log(`[Backend - Controller] Processing ${req.files.length} uploaded files...`);

            for (const file of req.files) {
                try {
                    // Try Cloudinary but don't crash if keys are missing/invalid
                    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
                        const result = await cloudinary.uploader.upload(file.path, {
                            folder: 'meeting_summarizer_files',
                            resource_type: 'auto'
                        });
                        imageUrls.push(result.secure_url);
                    } else {
                        console.warn('[Backend - Controller] Skipping Cloudinary upload (placeholders in .env)');
                    }
                } catch (cloudErr) {
                    console.error(`[Backend - Controller] Cloudinary Upload Warning: ${cloudErr.message}`);
                    // We continue because we can use local files for Gemini
                }
            }
        } else if (images && Array.isArray(images)) {
            imageUrls = images;
        }

        // 3. Summarize (Gemini Multimodal - using local files too)
        console.log('[Backend - Controller] Generating Multimodal Summary...');
        const summaryText = await generateSummary(transcript || '', userNotes || '', imageUrls, localPaths);

        // 4. Extract Title (Support both formats)
        let meetingTitle = 'New Meeting';
        const titleMatch1 = summaryText.match(/Main Heading:\s*(.*)/);
        const titleMatch2 = summaryText.match(/^#\s*(.*)/m);
        if (titleMatch1) meetingTitle = titleMatch1[1].trim();
        else if (titleMatch2) meetingTitle = titleMatch2[1].trim();

        // 5. Save to DB with User ID
        const newMeeting = new Meeting({
            user: req.user.id,
            title: meetingTitle,
            transcript: transcript,
            userNotes: userNotes || '',
            imageUrls: imageUrls, // Might be empty if no Cloudinary
            summary: summaryText
        });

        await newMeeting.save();
        console.log(`[Backend - Controller] Meeting saved with ID: ${newMeeting._id}`);

        // Cleanup local files
        localPaths.forEach(p => {
            if (fs.existsSync(p)) fs.unlinkSync(p);
        });

        res.status(201).json(newMeeting);

    } catch (error) {
        console.error('--- SUMMARIZE ERROR START ---');
        console.error(`[Backend - Controller] Error: ${error.message}`);
        // Cleanup local files on error
        localPaths.forEach(p => {
            if (fs.existsSync(p)) fs.unlinkSync(p);
        });
        res.status(500).json({ message: error.message || 'Error generating summary' });
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

// @desc    Send meeting summary via email
// @route   POST /api/meetings/:id/email
// @access  Private
const emailMeeting = async (req, res) => {
    try {
        const { recipientEmail } = req.body;

        if (!recipientEmail) {
            return res.status(400).json({ message: 'Recipient email is required' });
        }

        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        // Check for user authorization
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (meeting.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Send email
        const timestamp = new Date(meeting.createdAt).toLocaleString();
        await sendSummaryEmail(recipientEmail, meeting.title, meeting.summary, timestamp);

        console.log(`[Backend - Controller] Email sent for meeting ${meeting._id} to ${recipientEmail}`);
        res.json({ message: 'Email sent successfully', recipientEmail });

    } catch (error) {
        console.error('[Backend - Controller] Email Error:', error.message);
        res.status(500).json({ message: error.message || 'Error sending email' });
    }
};

module.exports = {
    transcribeMeeting,
    summarizeMeeting,
    getMeetings,
    getMeetingById,
    emailMeeting
};
