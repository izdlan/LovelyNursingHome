const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const feedback = new Feedback({ name, email, message });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        console.log('Getting all feedbacks...');
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        console.log('Found feedbacks:', feedbacks.length);
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Error fetching feedbacks', error });
    }
};

exports.replyToFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        const feedback = await Feedback.findByIdAndUpdate(id, { reply }, { new: true });
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        // Send email to user
        const emailNotifier = require('../services/emailNotifier');
        await emailNotifier.sendEmail(
            feedback.email,
            'Reply to your feedback',
            reply
        );
        res.json({ message: 'Reply sent and saved', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error replying to feedback', error });
    }
}; 