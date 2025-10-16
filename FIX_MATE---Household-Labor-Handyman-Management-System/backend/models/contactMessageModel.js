import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('ContactMessage', contactMessageSchema);