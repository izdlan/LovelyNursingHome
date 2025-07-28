const Feedback = require('../models/Feedback');
const { sendEmail } = require('../services/emailNotifier');

exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const feedback = new Feedback({ name, email, message });
        await feedback.save();
        
        // NO email to admin - admin will see feedback in dashboard
        console.log('Feedback submitted successfully:', feedback._id);
        
        // Redirect like add activity does
        res.redirect('/confirmation.html?title=Feedback+Submitted!&text=Thank+you+for+your+feedback.+We+will+get+back+to+you+soon.&btn=Submit+Another+Feedback&href=%2Ffeedback.html');
    } catch (error) {
        res.redirect('/confirmation.html?title=Error!&text=There+was+an+error+submitting+your+feedback.+Please+try+again.&btn=Try+Again&href=%2Ffeedback.html');
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
        
        // Send email TO the user who submitted the feedback
        try {
            const subject = 'Reply to your feedback - Lovely Nursing Home';
            const emailBody = `Dear ${feedback.name},\n\nThank you for your feedback. Here is our response:\n\n${reply}\n\nBest regards,\nLovely Nursing Home Team`;
            
            await sendEmail(feedback.email, subject, emailBody);
            console.log('Reply email sent to user:', feedback.email);
        } catch (emailError) {
            console.error('Failed to send reply email:', emailError);
            // Don't fail the reply if email fails
        }
        
        res.json({ message: 'Reply sent and saved', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error replying to feedback', error });
    }
}; 