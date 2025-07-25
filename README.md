# Lovely Nursing Home Management System

A comprehensive web-based management system for nursing homes, featuring volunteer coordination, donation tracking, activity management, and feedback systems.

## 🌟 Features

- **Admin Dashboard**: Complete administrative control panel
- **Volunteer Management**: Registration, approval, and activity booking
- **Donation System**: Track and manage donations with multiple payment modes
- **Activity Management**: Create and manage volunteer activities
- **Feedback System**: User feedback collection and admin responses
- **Email Notifications**: Automated email system for communications

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd LovelyNursingHome
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Main site: http://localhost:3000
   - Admin login: http://localhost:3000/admin_login.html
   - Volunteer login: http://localhost:3000/volunteer_login.html

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: bcryptjs for password hashing
- **File Upload**: Multer for image handling
- **Email**: Nodemailer for notifications
- **Scheduling**: node-cron for automated tasks

## 📁 Project Structure

```
LovelyNursingHome/
├── controllers/          # Route controllers
├── dao/                  # Data access objects
├── models/              # MongoDB schemas
├── public/              # Static files
│   ├── admin/           # Admin pages
│   ├── volunteer/       # Volunteer pages
│   └── uploads/         # Uploaded files
├── routes/              # Express routes
├── services/            # Business logic services
├── server.js            # Main application file
└── package.json         # Dependencies and scripts
```

## 🌐 Deployment

### Option 1: Render (Recommended - Free)

1. **Create Render account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Web Service"
   - Connect your GitHub repository
   - Configure settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       - `MONGODB_URI`: Your MongoDB connection string
       - `SESSION_SECRET`: A secure random string
       - `PORT`: 3000

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 2: Railway

1. **Create Railway account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Add environment variables
   - Deploy automatically

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and deploy**
   ```bash
   heroku login
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set SESSION_SECRET=your_session_secret
   ```

## 🚀 Deployment on Vercel

This application is configured for easy deployment on Vercel. Follow these steps:

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't already have an account

2. **Install Vercel CLI (Optional)**
   ```bash
   npm install -g vercel
   ```

3. **Deploy from GitHub**
   - Connect your GitHub repository to Vercel
   - Select the repository and configure the following:
     - **Framework Preset**: Other
     - **Build Command**: `npm run build`
     - **Output Directory**: `public`
     - **Install Command**: `npm install`

4. **Configure Environment Variables**
   - Add the following environment variables in the Vercel project settings:
     - `MONGODB_URI`: Your MongoDB connection string
     - `SESSION_SECRET`: A secure random string for session encryption
     - `EMAIL_USER`: Email for notifications
     - `EMAIL_PASS`: Email password or app password

5. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Your application will be live at `https://your-project-name.vercel.app`

### Important Notes for Vercel Deployment

- The `vercel.json` file in the root directory configures routing and build settings
- Vercel automatically deploys when you push changes to your connected repository
- You can set up preview deployments for pull requests
- The application uses serverless functions for the backend API

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `PORT` | Port number (default: 3000) | No |

## 📧 Email Configuration

Update the email settings in `services/emailNotifier.js`:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
```

## 🔒 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Input validation and sanitization
- Secure file upload handling
- Environment variable protection

## 📱 Features Overview

### Admin Features
- Dashboard with activity overview
- Volunteer approval system
- Donation tracking
- Activity management
- Feedback management
- Email notifications

### Volunteer Features
- Registration and login
- Activity booking
- Profile management
- Booking history

### Public Features
- Donation system
- Feedback submission
- Activity viewing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Updates

Stay updated with the latest features and security patches by regularly pulling from the main branch.

---

**Built with ❤️ for better nursing home management** 