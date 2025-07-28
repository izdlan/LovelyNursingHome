const Feedback = require('../models/Feedback');
const { sendEmail } = require('../services/emailNotifier');

exports.submitFeedback = async (req, res) => {
    try {
        console.log('=== FEEDBACK SUBMISSION START ===');
        console.log('Request body:', req.body);
        
        const { name, email, message } = req.body;
        console.log('Extracted data:', { name, email, message });
        
        // Validate required fields
        if (!name || !email || !message) {
            console.log('Missing required fields');
            return res.redirect('/confirmation.html?title=Error!&text=Missing+required+fields.+Please+try+again.&btn=Try+Again&href=%2Ffeedback.html');
        }
        
        console.log('Creating new feedback document...');
        const feedback = new Feedback({ name, email, message });
        console.log('Feedback document created:', feedback);
        
        console.log('Saving to database...');
        await feedback.save();
        console.log('Feedback saved successfully with ID:', feedback._id);
        
        // NO email to admin - admin will see feedback in dashboard
        console.log('Feedback submitted successfully:', feedback._id);
        
        // Redirect like add activity does
        console.log('Redirecting to confirmation page...');
        res.redirect('/confirmation.html?title=Feedback+Submitted!&text=Thank+you+for+your+feedback.+We+will+get+back+to+you+soon.&btn=Submit+Another+Feedback&href=%2Ffeedback.html');
    } catch (error) {
        console.error('=== FEEDBACK SUBMISSION ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
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