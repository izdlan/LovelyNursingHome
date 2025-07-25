# Lovely Nursing Home

A web application for managing a nursing home, including volunteer management, donation handling, and activity scheduling.

## Deployment Instructions

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open your browser to `http://localhost:3000`

### Vercel Deployment

To successfully deploy this application to Vercel:

1. Create a Vercel account and connect your repository
2. Set up the following environment variables in your Vercel project:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A strong secret for session management

3. Make sure your `vercel.json` file is properly configured (this repository includes the necessary configuration)

4. Deploy your project

**Important Note About Backend Functionality on Vercel:**

Vercel uses a serverless architecture, which means:
- The backend routes need to be configured as serverless functions
- Database connections are established and closed with each function call
- Session management works differently than in a traditional server environment

If you encounter issues with the backend functionality on Vercel, please check the following:
- Database connection string is correct in environment variables
- Routes are properly configured in `vercel.json`
- MongoDB Atlas IP access list includes Vercel's serverless function IP ranges

## Features

- Volunteer management
- Donation processing
- Activity scheduling
- Feedback collection
- Admin dashboard 