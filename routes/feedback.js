const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/', feedbackController.submitFeedback);
router.get('/all', feedbackController.getAllFeedback);
router.post('/:id/reply', feedbackController.replyToFeedback);

module.exports = router; 