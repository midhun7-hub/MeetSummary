const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Placeholder for protected route middleware if needed later
// router.get('/me', protect, getMe); 

module.exports = router;
