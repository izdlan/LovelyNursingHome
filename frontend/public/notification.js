// Custom Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.notificationId = 0;
    }

    show(message, type = 'success', duration = 3000) {
        const id = ++this.notificationId;
        const notification = this.createNotification(message, type, id);
        
        // Add to page
        document.body.appendChild(notification);
        this.notifications.push({ id, element: notification });

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Auto remove after duration
        setTimeout(() => {
            this.remove(id);
        }, duration);

        return id;
    }

    createNotification(message, type, id) {
        const notification = document.createElement('div');
        notification.id = `notification-${id}`;
        
        // Base styles
        const baseStyles = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: linear-gradient(90deg, #3578c7 0%, #004080 100%);
            color: #fff;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 2px 8px rgba(53,120,199,0.13);
            z-index: 2000;
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 90vw;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

        // Type-specific styles
        let typeStyles = '';
        switch (type) {
            case 'error':
                typeStyles = `
                    background: linear-gradient(90deg, #e53935 0%, #c62828 100%);
                    box-shadow: 0 2px 8px rgba(229,57,53,0.13);
                `;
                break;
            case 'warning':
                typeStyles = `
                    background: linear-gradient(90deg, #ff9800 0%, #f57c00 100%);
                    box-shadow: 0 2px 8px rgba(255,152,0,0.13);
                `;
                break;
            case 'info':
                typeStyles = `
                    background: linear-gradient(90deg, #2196f3 0%, #1976d2 100%);
                    box-shadow: 0 2px 8px rgba(33,150,243,0.13);
                `;
                break;
            default: // success
                typeStyles = `
                    background: linear-gradient(90deg, #3578c7 0%, #004080 100%);
                    box-shadow: 0 2px 8px rgba(53,120,199,0.13);
                `;
        }

        notification.style.cssText = baseStyles + typeStyles;
        notification.textContent = message;

        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 12px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
        closeBtn.onmouseout = () => closeBtn.style.opacity = '0.8';
        closeBtn.onclick = () => this.remove(id);
        
        notification.appendChild(closeBtn);

        return notification;
    }

    remove(id) {
        const notificationIndex = this.notifications.findIndex(n => n.id === id);
        if (notificationIndex === -1) return;

        const notification = this.notifications[notificationIndex].element;
        
        // Animate out
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.splice(notificationIndex, 1);
        }, 300);
    }

    removeAll() {
        this.notifications.forEach(n => this.remove(n.id));
    }
}

// Global notification instance
window.notifications = new NotificationSystem();

// Replace browser alert with custom notification
window.alert = function(message) {
    window.notifications.show(message, 'info', 4000);
};

// Helper functions for different notification types
window.showSuccess = function(message, duration = 3000) {
    return window.notifications.show(message, 'success', duration);
};

window.showError = function(message, duration = 4000) {
    return window.notifications.show(message, 'error', duration);
};

window.showWarning = function(message, duration = 4000) {
    return window.notifications.show(message, 'warning', duration);
};

window.showInfo = function(message, duration = 3000) {
    return window.notifications.show(message, 'info', duration);
};

// Custom confirm dialog
window.confirm = function(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
            max-width: 400px;
            width: 90vw;
            text-align: center;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #333; font-size: 1.2rem;">Confirm Action</h3>
            <p style="margin: 0 0 25px 0; color: #666; line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="confirm-yes" style="
                    background: linear-gradient(90deg, #3578c7 0%, #004080 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">Yes</button>
                <button id="confirm-no" style="
                    background: #e0e7ef;
                    color: #3578c7;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">No</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const handleYes = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };

        const handleNo = () => {
            document.body.removeChild(overlay);
            resolve(false);
        };

        modal.querySelector('#confirm-yes').onclick = handleYes;
        modal.querySelector('#confirm-no').onclick = handleNo;
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                handleNo();
            }
        };

        // Handle Enter and Escape keys
        const handleKey = (e) => {
            if (e.key === 'Enter') {
                handleYes();
            } else if (e.key === 'Escape') {
                handleNo();
            }
        };
        document.addEventListener('keydown', handleKey);
        
        // Clean up event listener when modal is closed
        const cleanup = () => {
            document.removeEventListener('keydown', handleKey);
        };
        overlay.addEventListener('remove', cleanup);
    });
}; 

// Chatbot FAQ/intents for English and Malay
window.chatbotFAQ = [
  // General Info
  { q: 'What is Lovely Nursing Home?', a: 'Lovely Nursing Home is a care facility for the elderly, providing a safe and comfortable environment.' },
  { q: 'Apakah itu Lovely Nursing Home?', a: 'Lovely Nursing Home ialah rumah jagaan warga emas yang menyediakan persekitaran selamat dan selesa.' },
  { q: 'Where is the nursing home located?', a: 'We are located at Petaling Jaya, Selangor D.E, West Malaysia. You can find our exact location on the map in our homepage.' },
  { q: 'Di manakah lokasi rumah jagaan ini?', a: 'Kami terletak di Petaling Jaya, Selangor D.E, Malaysia Barat. Anda boleh lihat lokasi tepat kami pada peta di laman utama kami.' },
  { q: 'How can I contact the nursing home?', a: 'You can contact us at [your phone/email here] or through the feedback form on our website.' },
  { q: 'Bagaimana saya boleh menghubungi rumah jagaan ini?', a: 'Anda boleh hubungi kami di [telefon/emel anda di sini] atau melalui borang maklum balas di laman web kami.' },
  { q: 'What are your visiting hours?', a: 'Our visiting hours are from 9am to 6pm daily.' },
  { q: 'Apakah waktu melawat di sini?', a: 'Waktu melawat adalah dari 9 pagi hingga 6 petang setiap hari.' },
  { q: 'When was Lovely Nursing Home established?', a: 'Lovely Nursing Home was established in July 1999 by Mr. Gopinath and his mother Madam Thanalechumi.' },
  { q: 'Who founded Lovely Nursing Home?', a: 'Lovely Nursing Home was founded by Mr. Gopinath and his mother Madam Thanalechumi in July 1999.' },
  { q: 'What is your address?', a: 'We are located in Petaling Jaya, Selangor D.E, West Malaysia. You can find our exact location on the map in our homepage.' },
  { q: 'What services do you provide?', a: 'We provide comprehensive care for the elderly including accommodation, meals, medical supervision, social activities, and 24-hour assistance.' },
  { q: 'Is there a doctor available?', a: 'Yes, we have medical professionals who regularly visit our facility to provide healthcare services to our residents.' },

  // Volunteer
  { q: 'How do I become a volunteer?', a: 'You can sign up as a volunteer on our website under the Volunteer section.' },
  { q: 'Bagaimana saya boleh menjadi sukarelawan?', a: 'Anda boleh mendaftar sebagai sukarelawan di laman web kami di bahagian Sukarelawan.' },
  { q: 'What activities can volunteers join?', a: 'Volunteers can join various activities such as gotong-royong, games, and helping residents.' },
  { q: 'Aktiviti apa yang boleh disertai oleh sukarelawan?', a: 'Sukarelawan boleh menyertai pelbagai aktiviti seperti gotong-royong, permainan, dan membantu penghuni.' },
  { q: 'Can I volunteer on weekends?', a: 'Yes, volunteering is available on weekends.' },
  { q: 'Bolehkah saya menjadi sukarelawan pada hujung minggu?', a: 'Ya, anda boleh menjadi sukarelawan pada hujung minggu.' },
  { q: 'How do I check my volunteer schedule?', a: 'Log in to your volunteer dashboard to view your schedule.' },
  { q: 'Bagaimana saya boleh semak jadual sukarelawan saya?', a: 'Log masuk ke papan pemuka sukarelawan untuk melihat jadual anda.' },
  { q: 'I forgot my volunteer login password.', a: 'Click on "Forgot Password" on the login page to reset your password.' },
  { q: 'Saya lupa kata laluan sukarelawan saya.', a: 'Klik "Lupa Kata Laluan" di halaman log masuk untuk menetapkan semula kata laluan.' },
  { q: 'Are there age requirements to volunteer?', a: 'We welcome volunteers of all ages, though minors will need parental consent. Please contact us for specific requirements.' },
  { q: 'How many hours do I need to volunteer?', a: 'You can volunteer for as many hours as you like. We have flexible schedules and appreciate any time you can give.' },
  { q: 'Do I need any qualifications to volunteer?', a: 'No specific qualifications are required to volunteer. We provide any necessary training for the activities.' },
  { q: 'Can I volunteer as part of a group?', a: 'Yes, we welcome group volunteers. Please contact us to arrange group volunteering opportunities.' },
  { q: 'What is the volunteer application process?', a: 'Sign up on our website, submit your details, and wait for admin approval. Once approved, you can start booking activities.' },
  { q: 'How long does volunteer approval take?', a: 'Volunteer applications are typically reviewed within 1-3 business days.' },
  
  // Donations
  { q: 'How can I donate to the nursing home?', a: 'You can donate online through our website or contact us for more options.' },
  { q: 'Bagaimana saya boleh menderma kepada rumah jagaan ini?', a: 'Anda boleh menderma secara dalam talian melalui laman web kami atau hubungi kami untuk pilihan lain.' },
  { q: 'What items do you need for donation?', a: 'We need daily essentials, food, and medical supplies.' },
  { q: 'Apakah barangan yang diperlukan untuk derma?', a: 'Kami memerlukan barangan harian, makanan, dan bekalan perubatan.' },
  { q: 'Can I donate money online?', a: 'Yes, you can donate money online via our donation page.' },
  { q: 'Bolehkah saya menderma wang secara dalam talian?', a: 'Ya, anda boleh menderma wang secara dalam talian melalui halaman derma kami.' },
  { q: 'How do I get a donation receipt?', a: 'Receipts are issued automatically for online donations, or contact us for manual receipts.' },
  { q: 'Bagaimana saya boleh dapatkan resit derma?', a: 'Resit akan dikeluarkan secara automatik untuk derma dalam talian, atau hubungi kami untuk resit manual.' },
  { q: 'Is my donation tax-deductible?', a: 'Yes, donations to Lovely Nursing Home are tax-deductible. You will receive a receipt for tax purposes.' },
  { q: 'Can I make a monthly donation?', a: 'Yes, we offer options for one-time donations or recurring monthly donations. You can select your preference on our donation page.' },
  { q: 'What is the current donation target?', a: 'Our monthly donation target is displayed on our homepage. You can see our progress and help us reach our goal.' },
  { q: 'Can I donate in memory of someone?', a: 'Yes, you can make memorial donations. Please indicate this in the donation form or contact us directly.' },
  { q: 'Can companies make donations?', a: 'Yes, we welcome corporate donations. Please contact us directly to discuss corporate giving opportunities.' },
  { q: 'What percentage of my donation goes to the residents?', a: 'We ensure that the vast majority of donations go directly to resident care and facility improvements.' },

  // Feedback
  { q: 'How do I give feedback about the services?', a: 'You can submit feedback through the Feedback page on our website.' },
  { q: 'Bagaimana saya boleh memberi maklum balas tentang perkhidmatan?', a: 'Anda boleh menghantar maklum balas melalui halaman Maklum Balas di laman web kami.' },
  { q: 'Who do I contact for complaints?', a: 'Please contact our admin at [your contact here] for complaints.' },
  { q: 'Siapa yang perlu saya hubungi untuk aduan?', a: 'Sila hubungi admin kami di [maklumat anda di sini] untuk aduan.' },
  { q: 'Will I receive a response to my feedback?', a: 'Yes, our admin team reviews all feedback and will respond to you via email if you provide your contact information.' },
  { q: 'How long will it take to get a response to my feedback?', a: 'We typically respond to feedback within 3-5 business days.' },
  { q: 'Can I give anonymous feedback?', a: 'Yes, you can submit feedback anonymously, though we won\'t be able to respond directly in that case.' },

  // Booking
  { q: 'How do I book an activity?', a: 'Log in to your volunteer account and click "Book" on the activity you want.' },
  { q: 'Bagaimana saya boleh tempah aktiviti?', a: 'Log masuk ke akaun sukarelawan anda dan klik "Tempah" pada aktiviti yang anda mahu.' },
  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel your booking from your dashboard.' },
  { q: 'Bolehkah saya batalkan tempahan saya?', a: 'Ya, anda boleh batalkan tempahan dari papan pemuka anda.' },
  { q: 'Why can\'t I book the same activity twice?', a: 'To ensure fair participation, each volunteer can only book an activity once.' },
  { q: 'Kenapa saya tidak boleh tempah aktiviti yang sama dua kali?', a: 'Untuk memastikan penyertaan adil, setiap sukarelawan hanya boleh tempah satu aktiviti sekali sahaja.' },
  { q: 'How far in advance can I book activities?', a: 'Activities are typically posted 1-2 months in advance and remain available for booking until all slots are filled.' },
  { q: 'Is there a limit to how many activities I can book?', a: 'You can book multiple different activities, but only one slot per specific activity to give everyone a chance to participate.' },
  { q: 'What happens after I book an activity?', a: 'After booking, the activity will appear in your dashboard. You\'ll receive a confirmation and reminder closer to the date.' },
  { q: 'Do I need to bring anything for the activities?', a: 'Requirements vary by activity. Check the activity description for any specific items you should bring.' },

  // Account
  { q: 'How do I register as a new user?', a: 'Click on Register and fill in the required details to create a new account.' },
  { q: 'Bagaimana saya boleh daftar sebagai pengguna baru?', a: 'Klik Daftar dan isi maklumat yang diperlukan untuk membuat akaun baru.' },
  { q: 'I can\'t log in to my account.', a: 'Please check your email and password, or use the Forgot Password option.' },
  { q: 'Saya tidak boleh log masuk ke akaun saya.', a: 'Sila semak emel dan kata laluan anda, atau gunakan pilihan Lupa Kata Laluan.' },
  { q: 'How do I update my profile?', a: 'Log in and go to your profile page to update your information.' },
  { q: 'Bagaimana saya boleh kemas kini profil saya?', a: 'Log masuk dan pergi ke halaman profil untuk kemas kini maklumat anda.' },
  { q: 'How do I delete my account?', a: 'Please contact our administrator if you wish to delete your account.' },
  { q: 'Is my personal information secure?', a: 'Yes, we take data security seriously and follow best practices to protect your personal information.' },
  { q: 'Can I change my email address?', a: 'Yes, you can update your email address in your profile settings after logging in.' },

  // Events
  { q: 'What upcoming events are there?', a: 'Check our Events page for the latest activities and events.' },
  { q: 'Apakah acara yang akan datang?', a: 'Sila semak halaman Acara untuk aktiviti dan acara terkini.' },
  { q: 'How do I join an event?', a: 'Click on the event and follow the instructions to join.' },
  { q: 'Bagaimana saya boleh sertai acara?', a: 'Klik pada acara dan ikut arahan untuk menyertai.' },
  { q: 'Are there any special holiday events?', a: 'Yes, we organize special events for major holidays throughout the year. Check our events page for details.' },
  { q: 'Do you need volunteers for special events?', a: 'Yes, we always need extra help for special events. Check the volunteer dashboard for these opportunities.' },
  { q: 'Can family members attend events?', a: 'Many of our events welcome family members. Check the specific event details for guest policies.' },

  // Residents
  { q: 'How many residents live at Lovely Nursing Home?', a: 'We currently care for a small group of elderly residents in our facility.' },
  { q: 'What is the age range of residents?', a: 'Our residents are typically senior citizens aged 65 and above.' },
  { q: 'Can I visit a specific resident?', a: 'Yes, you can visit specific residents during our visiting hours. Please contact us in advance to arrange your visit.' },
  { q: 'What activities do residents participate in?', a: 'Residents participate in various activities including arts and crafts, light exercises, music therapy, games, and social gatherings.' },
  { q: 'How do you care for residents with special needs?', a: 'We provide personalized care plans for residents with special needs, including medical attention and specialized assistance.' },

  // Other
  { q: 'Is there parking available?', a: 'Yes, parking is available for visitors.' },
  { q: 'Adakah tempat letak kereta disediakan?', a: 'Ya, tempat letak kereta disediakan untuk pelawat.' },
  { q: 'Do you accept used clothes or furniture?', a: 'Yes, we accept used clothes and furniture in good condition.' },
  { q: 'Adakah anda menerima pakaian atau perabot terpakai?', a: 'Ya, kami menerima pakaian dan perabot terpakai yang masih elok.' },
  { q: 'How do I get to the nursing home by public transport?', a: 'You can reach us by public transport. Please contact us for specific directions from your location.' },
  { q: 'Bagaimana saya boleh ke rumah jagaan ini dengan pengangkutan awam?', a: 'Anda boleh sampai ke sini dengan pengangkutan awam. Sila hubungi kami untuk arahan khusus dari lokasi anda.' },
  { q: 'Are pets allowed in the facility?', a: 'Service animals are allowed, but regular pets are generally not permitted for health and safety reasons.' },
  { q: 'Do you provide tour of the facility?', a: 'Yes, we offer tours of our facility by appointment. Please contact us to schedule a visit.' },
  { q: 'Is there Wi-Fi available?', a: 'Yes, we provide Wi-Fi for residents and visitors in common areas.' },
  { q: 'What COVID-19 safety measures do you have?', a: 'We follow all current health guidelines including regular sanitization, health screenings, and appropriate social distancing measures as needed.' },
  { q: 'Can I send cards or letters to residents?', a: 'Yes, cards and letters for residents are welcome and can be sent to our facility address.' },

  // Employment
  { q: 'Do you have job openings?', a: 'We occasionally have job openings. Please contact our administration for current opportunities.' },
  { q: 'What positions do you typically hire for?', a: 'We typically hire caregivers, nurses, administrative staff, kitchen staff, and maintenance personnel.' },
  { q: 'How can I apply for a job?', a: 'Please send your resume and cover letter to our administration email or contact us for application details.' },
  { q: 'Do you offer internships?', a: 'We sometimes offer internships for students in relevant fields. Please contact us for current opportunities.' },

  // Emergency
  { q: 'What should I do in case of emergency?', a: 'Contact our staff immediately or call 999 for urgent help.' },
  { q: 'Apa yang perlu saya lakukan jika berlaku kecemasan?', a: 'Hubungi staf kami segera atau dail 999 untuk bantuan kecemasan.' },
  { q: 'Who do I contact for urgent matters?', a: 'Please call our emergency number at [your emergency contact].' },
  { q: 'Siapa yang perlu saya hubungi untuk perkara kecemasan?', a: 'Sila hubungi nombor kecemasan kami di [nombor kecemasan anda].' },
  { q: 'Is there medical staff available 24/7?', a: 'Yes, we have caregivers available 24/7 and on-call medical professionals for emergencies.' },
  { q: 'What is your emergency evacuation procedure?', a: 'We have comprehensive emergency evacuation procedures in place that all staff are trained to follow.' },

  // Language
  { q: 'Can I get information in English?', a: 'Yes, you can ask your questions in English.' },
  { q: 'Bolehkah saya dapatkan maklumat dalam Bahasa Melayu?', a: 'Ya, anda boleh bertanya dalam Bahasa Melayu.' },
  { q: 'Do your staff speak languages other than English and Malay?', a: 'Many of our staff members speak multiple languages including Chinese dialects, Tamil, and others to better serve our diverse residents.' },
  
  // Website and technical questions
  { q: 'The website is not loading properly', a: 'Please try refreshing your browser or using a different browser. If problems persist, please contact our technical support.' },
  { q: 'How do I navigate your website?', a: 'Use the menu at the top of the page to navigate to different sections of our website.' },
  { q: 'Is the website secure?', a: 'Yes, our website uses secure protocols to protect your information.' },
  { q: 'Can I use your website on mobile devices?', a: 'Yes, our website is fully responsive and works well on mobile phones and tablets.' },
  { q: 'The chatbot is not answering my question', a: 'If the chatbot cannot answer your specific question, please use our feedback form or contact us directly for assistance.' }
]; 