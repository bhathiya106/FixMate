import express from 'express';
import ContactMessage from '../models/contactMessageModel.js';

const router = express.Router();

// POST /api/contact - receive contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    const contact = await ContactMessage.create({ name, email, phone, service, message });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// GET /api/contact - get all contact messages (admin)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ date: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
});

export default router;
