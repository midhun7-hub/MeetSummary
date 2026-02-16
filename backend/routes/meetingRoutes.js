const express = require('express');
const router = express.Router();
const multer = require('multer');
const meetingController = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Routes
router.post('/transcribe', protect, upload.single('audio'), meetingController.transcribeMeeting);
// Multi-part for summarize to allow images
router.post('/summarize', protect, upload.array('images', 5), meetingController.summarizeMeeting);

router.get('/', protect, meetingController.getMeetings);
router.get('/:id', protect, meetingController.getMeetingById);
router.post('/:id/email', protect, meetingController.emailMeeting);

module.exports = router;
