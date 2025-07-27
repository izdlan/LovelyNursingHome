import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'lovely_nursing_home';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db(dbName);
      const feedbacks = db.collection('feedbacks');
      await feedbacks.insertOne({ name, email, message, createdAt: new Date() });
      await client.close();
      return res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 