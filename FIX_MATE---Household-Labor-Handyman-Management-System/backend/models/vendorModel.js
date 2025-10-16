import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	hourlyRate: { type: Number, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAccountVerified: { type: Boolean, default: false },
	profileImageUrl: { type: String, default: '' },
	profileImagePublicId: { type: String, default: '' },
	phone: { type: String, default: '' },
	address: { type: String, default: '' },
	galleryImages: { type: [String], default: [] },
	galleryImagePublicIds: { type: [String], default: [] },
	description: { type: String, default: '' },
	// Password reset fields
	resetOtp: { type: String, default: '' },
	resetOtpExpireAt: { type: Number, default: 0 }
});

const vendorModel = mongoose.models.vendor || mongoose.model('vendors', vendorSchema);

export default vendorModel;
