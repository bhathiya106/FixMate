import mongoose from 'mongoose';

const bannedEmailSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true, unique: true },
    type: { type: String, required: true, default: 'delivery' }, // e.g., 'delivery'
    reason: { type: String, default: '' },
    createdBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

const BannedEmail = mongoose.model('BannedEmail', bannedEmailSchema);

export default BannedEmail;
