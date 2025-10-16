// Admin: Verify vendor account
export const verifyVendor = async (req, res) => {
	try {
		const { id } = req.params;
		const vendor = await vendorModel.findByIdAndUpdate(id, { isAccountVerified: true }, { new: true });
		if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
		res.json({ success: true, message: 'Vendor verified' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
import vendorModel from '../models/vendorModel.js';
import BannedEmail from '../models/bannedEmailModel.js';
import VendorNotice from '../models/vendorNoticeModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/EmailTemplate.js';


export const getAllVendors = async (req, res) => {
	try {
		const vendors = await vendorModel.find({}, 'name email category hourlyRate isAccountVerified');
		console.log('Fetched vendors:', vendors);
		res.json({ success: true, vendors });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};


export const deleteVendor = async (req, res) => {
	try {
		const { id } = req.params;
		const vendor = await vendorModel.findByIdAndDelete(id);
		if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
		res.json({ success: true, message: 'Vendor deleted' });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

export const getVendorById = async (req, res) => {
	try {
		const { id } = req.params;
		const vendor = await vendorModel.findById(id);
		if (!vendor) {
			return res.status(404).json({ success: false, message: 'Vendor not found' });
		}
		return res.json({
			success: true,
			vendor: {
				_id: vendor._id,
				name: vendor.name,
				category: vendor.category,
				hourlyRate: vendor.hourlyRate,
				email: vendor.email,
				isAccountVerified: vendor.isAccountVerified,
				phone: vendor.phone || '',
				address: vendor.address || '',
				profileImageUrl: vendor.profileImageUrl || '',
				galleryImages: vendor.galleryImages || [],
				description: vendor.description || ''
			}
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const getVendorsByCategory = async (req, res) => {
	try {
		const { category } = req.params;
		if (!category) {
			return res.status(400).json({ success: false, message: 'Category is required' });
		}

		// Only return vendors whose accounts are verified by admin
		const vendors = await vendorModel.find({
			category: { $regex: `^${category}$`, $options: 'i' },
			isAccountVerified: true
		});
		if (!vendors.length) {
			return res.json({ success: true, vendors: [] });
		}

		// Exclude banned vendors
		const bannedList = await BannedEmail.find({ type: 'vendor' }, 'email');
		const bannedSet = new Set(bannedList.map(b => (b.email || '').toLowerCase()));

		const vendorList = vendors
			.filter(v => !bannedSet.has((v.email || '').toLowerCase()))
			.map(vendor => ({
			_id: vendor._id,
			name: vendor.name,
			category: vendor.category,
			hourlyRate: vendor.hourlyRate,
			email: vendor.email,
			isAccountVerified: vendor.isAccountVerified,
			phone: vendor.phone || '',
			address: vendor.address || '',
			profileImageUrl: vendor.profileImageUrl || '',
			galleryImages: vendor.galleryImages || [],
			description: vendor.description || ''
		}));
		return res.json({ success: true, vendors: vendorList });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
export const updateVendorProfile = async (req, res) => {
	try {
		const vendorId = req.user.id;
		const { name, phone, address, hourlyRate, description } = req.body;
		const vendor = await vendorModel.findById(vendorId);
		if (!vendor) {
			return res.json({ success: false, message: 'Vendor not found' });
		}
		if (name) vendor.name = name;
		if (phone !== undefined) vendor.phone = phone;
		if (address !== undefined) vendor.address = address;
		if (hourlyRate !== undefined) vendor.hourlyRate = hourlyRate;
		if (description !== undefined) vendor.description = description;

	
		if (req.files && req.files['profileImage'] && req.files['profileImage'][0]) {
		
			if (vendor.profileImagePublicId) {
				try { await cloudinary.v2.uploader.destroy(vendor.profileImagePublicId); } catch {}
			}
			
			const streamUpload = (fileBuffer) => {
				return new Promise((resolve, reject) => {
					const stream = cloudinary.v2.uploader.upload_stream(
						{ folder: 'vendors' },
						(error, result) => {
							if (result) resolve(result);
							else reject(error);
						}
					);
					streamifier.createReadStream(fileBuffer).pipe(stream);
				});
			};
			const result = await streamUpload(req.files['profileImage'][0].buffer);
			vendor.profileImageUrl = result.secure_url;
			vendor.profileImagePublicId = result.public_id;
		}


		let galleryUrls = [];
		let galleryPublicIds = [];
		for (let i = 1; i <= 4; i++) {
			const field = `galleryImage${i}`;
			if (req.files && req.files[field] && req.files[field][0]) {
				const streamUpload = (fileBuffer) => {
					return new Promise((resolve, reject) => {
						const stream = cloudinary.v2.uploader.upload_stream(
							{ folder: 'vendors/gallery' },
							(error, result) => {
								if (result) resolve(result);
								else reject(error);
							}
						);
						streamifier.createReadStream(fileBuffer).pipe(stream);
					});
				};
				const result = await streamUpload(req.files[field][0].buffer);
				galleryUrls.push(result.secure_url);
				galleryPublicIds.push(result.public_id);
			}
		}
		if (galleryUrls.length > 0) {
			vendor.galleryImages = galleryUrls;
			vendor.galleryImagePublicIds = galleryPublicIds;
		}

		await vendor.save();
		return res.json({ success: true, vendor });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const getVendorData = async (req, res) => {
	try {
		const vendorId = req.user.id;
		const vendor = await vendorModel.findById(vendorId);
		if (!vendor) {
			return res.json({ success: false, message: 'Vendor not found' });
		}
		const banned = await BannedEmail.findOne({ email: (vendor.email || '').toLowerCase(), type: 'vendor' });
		res.json({
			success: true,
			vendor: {
				_id: vendor._id,
				name: vendor.name,
				category: vendor.category,
				hourlyRate: vendor.hourlyRate,
				email: vendor.email,
				isAccountVerified: vendor.isAccountVerified,
				isBanned: !!banned,
				phone: vendor.phone || '',
				address: vendor.address || '',
				profileImageUrl: vendor.profileImageUrl || '',
				galleryImages: vendor.galleryImages || [],
				description: vendor.description || ''
			}
		});
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};


export const registerVendor = async (req, res) => {
	const { name, category, hourlyRate, email, password } = req.body;
	if (!name || !category || !hourlyRate || !email || !password) {
		return res.json({ success: false, message: 'Missing Details' });
	}
	try {
		const banned = await BannedEmail.findOne({ email: email.toLowerCase(), type: 'vendor' });
		if (banned) {
			return res.json({ success: false, message: 'This email is banned from registering as vendor' });
		}
		const existingVendor = await vendorModel.findOne({ email });
		if (existingVendor) {
			return res.json({ success: false, message: 'Vendor already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const vendor = new vendorModel({ name, category, hourlyRate, email, password: hashedPassword });
		await vendor.save();
		const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie('vendor_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});
		return res.json({ success: true });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};


export const loginVendor = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.json({ success: false, message: 'Email and password are required' });
	}
	try {
		const banned = await BannedEmail.findOne({ email: email.toLowerCase(), type: 'vendor' });
		if (banned) {
			return res.json({ success: false, message: 'This account has been banned. Contact admin.' });
		}
		const vendor = await vendorModel.findOne({ email });
		if (!vendor) {
			return res.json({ success: false, message: 'Vendor not found' });
		}
		const isMatch = await bcrypt.compare(password, vendor.password);
		if (!isMatch) {
			return res.json({ success: false, message: 'Invalid credentials' });
		}
		const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie('vendor_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});
		return res.json({ success: true });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};

// Admin: Ban/Unban vendor and send notices
export const adminBanVendorByEmail = async (req, res) => {
	try {
		const { email, reason } = req.body;
		if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
		const record = await BannedEmail.findOneAndUpdate(
			{ email: email.toLowerCase(), type: 'vendor' },
			{ $set: { reason: reason || '', createdBy: req.user?.email || 'admin' } },
			{ upsert: true, new: true }
		);
		return res.json({ success: true, message: 'Vendor banned', ban: record });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to ban vendor' });
	}
};

export const adminUnbanVendorByEmail = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
		await BannedEmail.deleteOne({ email: email.toLowerCase(), type: 'vendor' });
		return res.json({ success: true, message: 'Vendor unbanned' });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to unban vendor' });
	}
};

export const adminSendVendorNotice = async (req, res) => {
	try {
		const { vendorId, message } = req.body;
		if (!vendorId || !message) return res.status(400).json({ success: false, message: 'vendorId and message are required' });
		const vendor = await vendorModel.findById(vendorId);
		if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
		const notice = await VendorNotice.create({ vendorId, message, createdBy: req.user?.email || 'admin' });
		return res.json({ success: true, message: 'Notice sent', notice });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to send notice' });
	}
};

export const getMyVendorNotices = async (req, res) => {
	try {
		const notices = await VendorNotice.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
		return res.json({ success: true, notices });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to get notices' });
	}
};

export const markVendorNoticeRead = async (req, res) => {
	try {
		const { id } = req.params;
		const notice = await VendorNotice.findOneAndUpdate(
			{ _id: id, vendorId: req.user.id },
			{ $set: { read: true } },
			{ new: true }
		);
		if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
		return res.json({ success: true, message: 'Notice marked as read', notice });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to update notice' });
	}
};


export const logoutVendor = async (req, res) => {
	try {
		res.clearCookie('vendor_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
		});
		return res.json({ success: true, message: 'Logged Out' });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};

// Vendor: Send reset OTP
export const sendVendorResetOtp = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		return res.json({ success: false, message: 'Email is Required' });
	}
	try {
		const vendor = await vendorModel.findOne({ email });
		if (!vendor) {
			return res.json({ success: false, message: 'Vendor not Found' });
		}
		const otp = String(Math.floor(100000 + Math.random() * 900000));
		vendor.resetOtp = otp;
		vendor.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
		await vendor.save();
		// send email via transporter
		try {
			const mailOptions = {
				from: process.env.SENDER_EMAIL,
				to: vendor.email,
				subject: 'Vendor Password Reset OTP',
				html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", vendor.email)
			};
			await transporter.sendMail(mailOptions);
		} catch (e) {
			// ignore email errors but log
			console.error('Failed to send vendor reset email', e?.message || e);
		}
		return res.json({ success: true, message: 'OTP has been sent to your email' });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};

// Vendor: Reset password
export const resetVendorPassword = async (req, res) => {
const { email, otp, newPassword } = req.body;
if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP and new Password Required' });
}
try {
    const vendor = await vendorModel.findOne({ email });
    if (!vendor) {
        return res.json({ success: false, message: 'Vendor Not Available' });
    }
    if (vendor.resetOtp === '' || vendor.resetOtp !== otp) {
        return res.json({ success: false, message: 'Invalid OTP' });
    }
    if (vendor.resetOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: 'OTP expired' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    vendor.password = hashedPassword;
    vendor.resetOtp = '';
    vendor.resetOtpExpireAt = 0;
    await vendor.save();
    return res.json({ success: true, message: 'Password has been changed successfully' });
} catch (error) {
    return res.json({ success: false, message: error.message });
}
};
