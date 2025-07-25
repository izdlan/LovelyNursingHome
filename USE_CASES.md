# Lovely Nursing Home Management System - Use Cases

## 📋 System Overview

The Lovely Nursing Home Management System is a comprehensive web-based platform designed to streamline operations for a nursing home facility. The system manages volunteer coordination, donation tracking, activity management, and feedback systems to support the care and comfort of elderly residents.

## 🎯 Primary Users

1. **Administrators** - Nursing home staff who manage the facility
2. **Volunteers** - Individuals who want to help and participate in activities
3. **Donors** - People who want to support the nursing home financially
4. **General Public** - Visitors who want to learn about the facility

---

## 👨‍💼 ADMIN USE CASES

### UC-ADM-001: Admin Authentication
**Actor:** Administrator  
**Precondition:** Admin has valid credentials  
**Main Flow:**
1. Admin navigates to admin login page
2. Enters username and password
3. System validates credentials
4. System redirects to admin dashboard
**Postcondition:** Admin is logged in and can access admin features

### UC-ADM-002: Manage Volunteer Registrations
**Actor:** Administrator  
**Precondition:** Admin is logged in  
**Main Flow:**
1. Admin views pending volunteer requests
2. Reviews volunteer information (name, email, phone)
3. Approves or rejects volunteer application
4. System sends email notification to volunteer
**Postcondition:** Volunteer status is updated and notified

### UC-ADM-003: Create Volunteer Activities
**Actor:** Administrator  
**Precondition:** Admin is logged in  
**Main Flow:**
1. Admin navigates to "Add New Activity" page
2. Enters activity details (title, description, date, time, slots)
3. Uploads activity image
4. Submits activity creation
**Postcondition:** New activity is created and visible to volunteers

### UC-ADM-004: Monitor Activity Bookings
**Actor:** Administrator  
**Precondition:** Admin is logged in, activities exist  
**Main Flow:**
1. Admin views dashboard with all activities
2. Sees booking requests for each activity
3. Reviews volunteer details for each booking
4. Approves or rejects booking requests
5. System notifies volunteers of decision
**Postcondition:** Booking status is updated and volunteers are notified

### UC-ADM-005: Manage Donations
**Actor:** Administrator  
**Precondition:** Admin is logged in  
**Main Flow:**
1. Admin views all donation records
2. Reviews donor information and amounts
3. Sets monthly donation targets
4. Monitors donation progress
**Postcondition:** Donation data is tracked and targets are set

### UC-ADM-006: Handle User Feedback
**Actor:** Administrator  
**Precondition:** Admin is logged in, feedback exists  
**Main Flow:**
1. Admin views all user feedback
2. Reads feedback messages
3. Composes reply to feedback
4. Sends email response to user
**Postcondition:** User receives response to their feedback

### UC-ADM-007: View System Analytics
**Actor:** Administrator  
**Precondition:** Admin is logged in  
**Main Flow:**
1. Admin views donation summary dashboard
2. Sees total collected amount, donor counts
3. Reviews monthly vs one-time donor statistics
4. Analyzes average and highest donations
**Postcondition:** Admin has insights into fundraising performance

---

## 🤝 VOLUNTEER USE CASES

### UC-VOL-001: Volunteer Registration
**Actor:** Potential Volunteer  
**Precondition:** User has internet access  
**Main Flow:**
1. User navigates to volunteer signup page
2. Fills in personal information (name, email, phone, password)
3. Submits registration form
4. System creates volunteer account (pending approval)
**Postcondition:** Volunteer account is created and pending admin approval

### UC-VOL-002: Volunteer Login
**Actor:** Registered Volunteer  
**Precondition:** Volunteer account is approved  
**Main Flow:**
1. Volunteer enters email and password
2. System validates credentials
3. System checks approval status
4. If approved, redirects to volunteer dashboard
**Postcondition:** Volunteer is logged in and can access volunteer features

### UC-VOL-003: Browse Available Activities
**Actor:** Logged-in Volunteer  
**Precondition:** Volunteer is logged in, activities exist  
**Main Flow:**
1. Volunteer views list of available activities
2. Sees activity details (date, time, slots, description)
3. Reviews activity images and requirements
4. Selects activity to book
**Postcondition:** Volunteer can see all available activities

### UC-VOL-004: Book Activity
**Actor:** Logged-in Volunteer  
**Precondition:** Volunteer is logged in, activity has available slots  
**Main Flow:**
1. Volunteer selects an activity
2. Confirms booking details
3. Submits booking request
4. System creates booking (pending approval)
**Postcondition:** Booking request is submitted and pending admin approval

### UC-VOL-005: View Booking Status
**Actor:** Logged-in Volunteer  
**Precondition:** Volunteer has made bookings  
**Main Flow:**
1. Volunteer views their dashboard
2. Sees list of their bookings
3. Reviews status (pending, approved, rejected)
4. Views activity details for each booking
**Postcondition:** Volunteer knows status of all their bookings

### UC-VOL-006: Update Profile
**Actor:** Logged-in Volunteer  
**Precondition:** Volunteer is logged in  
**Main Flow:**
1. Volunteer accesses profile settings
2. Updates personal information
3. Changes password if needed
4. Saves profile changes
**Postcondition:** Volunteer profile is updated

---

## 💰 DONOR USE CASES

### UC-DON-001: Make Donation
**Actor:** Potential Donor  
**Precondition:** User has internet access  
**Main Flow:**
1. User navigates to donation page
2. Fills in personal details (name, email, contact)
3. Selects donation type (one-time/monthly)
4. Enters donation amount
5. Chooses payment method (Visa/MasterCard, FPX, QRPay)
6. Provides payment details
7. Consents to data usage
8. Submits donation
**Postcondition:** Donation is processed and recorded

### UC-DON-002: Anonymous Donation
**Actor:** Potential Donor  
**Precondition:** User has internet access  
**Main Flow:**
1. User fills donation form
2. Chooses not to consent to data usage
3. System automatically sets name as "Anonymous"
4. Completes donation process
**Postcondition:** Anonymous donation is recorded

### UC-DON-003: View Donation Impact
**Actor:** General Public  
**Precondition:** User has internet access  
**Main Flow:**
1. User visits homepage
2. Views donor list section
3. Sees monthly donation totals
4. Views individual donor contributions
5. Checks progress toward monthly targets
**Postcondition:** User understands donation impact

---

## 🌐 GENERAL PUBLIC USE CASES

### UC-PUB-001: Browse Nursing Home Information
**Actor:** General Public  
**Precondition:** User has internet access  
**Main Flow:**
1. User visits homepage
2. Reads about nursing home history
3. Views location on map
4. Learns about services offered
**Postcondition:** User understands nursing home mission

### UC-PUB-002: View Volunteer Activities
**Actor:** General Public  
**Precondition:** User has internet access  
**Main Flow:**
1. User visits homepage
2. Views volunteer activities section
3. Sees upcoming activities with details
4. Understands volunteer opportunities
5. Clicks "Sign Up to Join" to register
**Postcondition:** User is motivated to become a volunteer

### UC-PUB-003: Submit Feedback
**Actor:** General Public  
**Precondition:** User has internet access  
**Main Flow:**
1. User navigates to feedback page
2. Fills in contact information
3. Writes feedback message
4. Submits feedback form
**Postcondition:** Feedback is submitted to admin

---

## 🔧 SYSTEM USE CASES

### UC-SYS-001: Email Notifications
**Actor:** System  
**Precondition:** Email service is configured  
**Main Flow:**
1. System detects event requiring notification
2. Generates appropriate email content
3. Sends email to relevant user
4. Logs email delivery status
**Postcondition:** User receives notification email

### UC-SYS-002: Monthly Donation Reminders
**Actor:** System  
**Precondition:** Monthly donors exist, email service configured  
**Main Flow:**
1. System checks for monthly donors
2. Generates thank you emails
3. Sends emails to monthly donors
4. Logs reminder delivery
**Postcondition:** Monthly donors receive appreciation emails

### UC-SYS-003: Data Backup
**Actor:** System  
**Precondition:** Database is operational  
**Main Flow:**
1. System performs regular data backup
2. Stores backup securely
3. Logs backup completion
4. Verifies backup integrity
**Postcondition:** System data is safely backed up

---

## 📊 REPORTING USE CASES

### UC-REP-001: Generate Donation Reports
**Actor:** Administrator  
**Precondition:** Admin is logged in, donation data exists  
**Main Flow:**
1. Admin accesses donation analytics
2. Views total collected amounts
3. Analyzes donor demographics
4. Reviews monthly trends
5. Exports data if needed
**Postcondition:** Admin has comprehensive donation insights

### UC-REP-002: Volunteer Activity Reports
**Actor:** Administrator  
**Precondition:** Admin is logged in, volunteer data exists  
**Main Flow:**
1. Admin views volunteer participation
2. Reviews activity booking statistics
3. Analyzes volunteer engagement
4. Identifies popular activities
**Postcondition:** Admin understands volunteer engagement patterns

---

## 🔒 SECURITY USE CASES

### UC-SEC-001: Password Security
**Actor:** All Users  
**Precondition:** User has account  
**Main Flow:**
1. User creates password during registration
2. System hashes password using bcrypt
3. Stores hashed password in database
4. Validates password during login
**Postcondition:** User passwords are securely stored

### UC-SEC-002: Session Management
**Actor:** System  
**Precondition:** User is authenticated  
**Main Flow:**
1. System creates session upon login
2. Maintains session during user activity
3. Validates session for protected routes
4. Destroys session upon logout
**Postcondition:** User sessions are properly managed

---

## 📱 MOBILE RESPONSIVENESS USE CASES

### UC-MOB-001: Mobile Navigation
**Actor:** All Users  
**Precondition:** User accesses site on mobile device  
**Main Flow:**
1. User opens site on mobile browser
2. Navigation adapts to mobile layout
3. Content is properly sized for mobile
4. Touch interactions work correctly
**Postcondition:** Site is fully functional on mobile devices

---

## 🎯 SUCCESS METRICS

### Volunteer Engagement
- Number of registered volunteers
- Activity booking rates
- Volunteer retention rates

### Donation Performance
- Total donation amounts
- Monthly donor retention
- Average donation amounts

### System Usage
- Daily active users
- Page view statistics
- Feature adoption rates

### User Satisfaction
- Feedback response rates
- User engagement metrics
- System performance indicators

---

## 🔄 FUTURE ENHANCEMENTS

### Potential Use Cases
1. **Real-time Chat** - Direct communication between volunteers and staff
2. **Mobile App** - Native mobile application for volunteers
3. **Advanced Analytics** - Detailed reporting and insights
4. **Integration** - Connect with external systems (payment gateways, etc.)
5. **Multi-language Support** - Support for multiple languages
6. **Push Notifications** - Real-time notifications for activities and updates

---

*This use case document provides a comprehensive overview of all system functionalities and user interactions for the Lovely Nursing Home Management System.* 