const Feedback = require('../models/Feedback');
const { sendEmail } = require('../services/emailNotifier');

exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const feedback = new Feedback({ name, email, message });
        await feedback.save();
        
        // Send email notification to admin (similar to add activity)
        try {
            const subject = `New Feedback Received from ${name}`;
            const emailBody = `Dear Admin,\n\nA new feedback has been submitted:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n\nPlease log in to your admin dashboard to review and respond to this feedback.\n\nThank you,\nLovely Nursing Home System`;
            
            // Send to admin email (you can set this in environment variables)
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@lovelynursinghome.com';
            await sendEmail(adminEmail, subject, emailBody);
            
            console.log('Feedback email sent to admin');
        } catch (emailError) {
            console.error('Failed to send feedback email:', emailError);
            // Don't fail the feedback submission if email fails
        }
        
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