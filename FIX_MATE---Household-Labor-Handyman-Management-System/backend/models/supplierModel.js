import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String, default: '' },
    phone: { type: String, default: '' },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    profileImageUrl: { type: String, default: '' },
    profileImagePublicId: { type: String, default: '' },
    location: { type: String, default: '' }
})

const supplierModel = mongoose.models.supplier || mongoose.model('suppliers', supplierSchema);

export default supplierModel;