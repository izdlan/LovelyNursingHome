const Feedback = require('../models/Feedback');
const { sendEmail } = require('../services/emailNotifier');

exports.submitFeedback = async (req, res) => {
    try {
        console.log('=== FEEDBACK SUBMISSION START ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        
        // Handle both form data and JSON data
        let name, email, message;
        
        if (req.body) {
            // If req.body exists, extract from it
            name = req.body.name;
            email = req.body.email;
            message = req.body.message;
        } else {
            // If req.body is undefined, try to parse from raw body
            console.log('req.body is undefined, trying to parse raw body...');
            const rawBody = req.rawBody || '';
            console.log('Raw body:', rawBody);
            
            // Parse multipart/form-data
            if (rawBody.includes('Content-Disposition: form-data')) {
                console.log('Detected multipart/form-data, parsing...');
                
                // Extract name
                const nameMatch = rawBody.match(/name="name"\r?\n\r?\n([^\r\n]+)/);
                name = nameMatch ? nameMatch[1] : null;
                
                // Extract email
                const emailMatch = rawBody.match(/name="email"\r?\n\r?\n([^\r\n]+)/);
                email = emailMatch ? emailMatch[1] : null;
                
                // Extract message
                const messageMatch = rawBody.match(/name="message"\r?\n\r?\n([^\r\n]+)/);
                message = messageMatch ? messageMatch[1] : null;
                
                console.log('Parsed multipart data:', { name, email, message });
            } else {
                // Try to parse as URL-encoded form data
                const urlParams = new URLSearchParams(rawBody);
                name = urlParams.get('name');
                email = urlParams.get('email');
                message = urlParams.get('message');
            }
        }
        
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