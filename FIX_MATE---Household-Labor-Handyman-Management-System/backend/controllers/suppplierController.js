// Admin: Verify supplier
export const verifySupplier = async (req, res) => {
	try {
		const { id } = req.params;
		const supplier = await supplierModel.findByIdAndUpdate(id, { isAccountVerified: true }, { new: true });
		if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
		res.json({ success: true, message: 'Supplier verified', supplier });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
// Supplier: Update profile
export const updateSupplierProfile = async (req, res) => {
	try {
		const supplierId = req.user.id;
		const { name, businessName, phone, location } = req.body;
		const supplier = await supplierModel.findById(supplierId);
		if (!supplier) {
			return res.status(404).json({ success: false, message: 'Supplier Not Found' });
		}
		if (name !== undefined) supplier.name = name;
		if (businessName !== undefined) supplier.businessName = businessName;
		if (phone !== undefined) supplier.phone = phone;
		if (location !== undefined) supplier.location = location;
		await supplier.save();
		res.json({ success: true, message: 'Profile updated successfully', supplier });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
// Admin: Get all suppliers
export const getAllSuppliers = async (req, res) => {
	try {
		const suppliers = await supplierModel.find({}, 'name email isAccountVerified');
		res.json({ success: true, suppliers });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Admin: Delete supplier
export const deleteSupplier = async (req, res) => {
	try {
		const { id } = req.params;
		const supplier = await supplierModel.findByIdAndDelete(id);
		if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
		res.json({ success: true, message: 'Supplier deleted' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supplierModel from '../models/supplierModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/EmailTemplate.js';
import BannedEmail from '../models/bannedEmailModel.js';
import SupplierNotice from '../models/supplierNoticeModel.js';


export const getSupplierData = async (req, res) => {
	try {
		const supplierId = req.user.id;
		const supplier = await supplierModel.findById(supplierId);
		if (!supplier) {
			return res.json({ success: false, message: 'Supplier Not Found' });
		}
		const banned = await BannedEmail.findOne({ email: (supplier.email || '').toLowerCase(), type: 'supplier' });
		res.json({
			success: true,
			supplierData: {
				_id: supplier._id,
				name: supplier.name,
				email: supplier.email,
				isAccountVerified: supplier.isAccountVerified,
				isBanned: !!banned,
				businessName: supplier.businessName,
				phone: supplier.phone,
				location: supplier.location,
				profileImageUrl: supplier.profileImageUrl || ''
			}
		});
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};


export const registerSupplier = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.json({ success: false, message: 'Missing Details' });
	}
	try {
		const banned = await BannedEmail.findOne({ email: email.toLowerCase(), type: 'supplier' });
		if (banned) {
			return res.json({ success: false, message: 'This email is banned from registering as supplier' });
		}
		const existingSupplier = await supplierModel.findOne({ email });
		if (existingSupplier) {
			return res.json({ success: false, message: 'Supplier Already Exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const supplier = new supplierModel({ name, email, password: hashedPassword });
		await supplier.save();
		const token = jwt.sign({ id: supplier._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie('supplier_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		await new Promise(resolve => setTimeout(resolve, 100)); // Wait for cookie to be set
	
		const mailOptions = {
			from: process.env.SENDER_EMAIL,
			to: email,
			subject: 'Welcome To FIX-MATE (Supplier)',
			text: `Your supplier account has been created.\nEmail: ${email}`
		};
		await transporter.sendMail(mailOptions);
		return res.json({ success: true });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};


export const loginSupplier = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.json({ success: false, message: 'Email and password are required' });
	}
	try {
		const banned = await BannedEmail.findOne({ email: email.toLowerCase(), type: 'supplier' });
		if (banned) {
			return res.json({ success: false, message: 'This account has been banned. Contact admin.' });
		}
		const supplier = await supplierModel.findOne({ email });
		if (!supplier) {
			return res.json({ success: false, message: 'Invalid Supplier Email' });
		}
		const isMatch = await bcrypt.compare(password, supplier.password);
		if (!isMatch) {
			return res.json({ success: false, message: 'Invalid Supplier Password' });
		}
		const token = jwt.sign({ id: supplier._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie('supplier_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});
		return res.json({ success: true, token });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};

// Admin: Ban/Unban and send notices to suppliers
export const adminBanSupplierByEmail = async (req, res) => {
	try {
		const { email, reason } = req.body;
		if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
		const record = await BannedEmail.findOneAndUpdate(
			{ email: email.toLowerCase(), type: 'supplier' },
			{ $set: { reason: reason || '', createdBy: req.user?.email || 'admin' } },
			{ upsert: true, new: true }
		);
		return res.json({ success: true, message: 'Supplier banned', ban: record });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to ban supplier' });
	}
};

export const adminUnbanSupplierByEmail = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
		await BannedEmail.deleteOne({ email: email.toLowerCase(), type: 'supplier' });
		return res.json({ success: true, message: 'Supplier unbanned' });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to unban supplier' });
	}
};

export const adminSendSupplierNotice = async (req, res) => {
	try {
		const { supplierId, message } = req.body;
		if (!supplierId || !message) return res.status(400).json({ success: false, message: 'supplierId and message are required' });
		const supplier = await supplierModel.findById(supplierId);
		if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
		const notice = await SupplierNotice.create({ supplierId, message, createdBy: req.user?.email || 'admin' });
		return res.json({ success: true, message: 'Notice sent', notice });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to send notice' });
	}
};

export const getMySupplierNotices = async (req, res) => {
	try {
		const notices = await SupplierNotice.find({ supplierId: req.user.id }).sort({ createdAt: -1 });
		return res.json({ success: true, notices });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to get notices' });
	}
};

export const markSupplierNoticeRead = async (req, res) => {
	try {
		const { id } = req.params;
		const notice = await SupplierNotice.findOneAndUpdate(
			{ _id: id, supplierId: req.user.id },
			{ $set: { read: true } },
			{ new: true }
		);
		if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
		return res.json({ success: true, message: 'Notice marked as read', notice });
	} catch (e) {
		return res.status(500).json({ success: false, message: 'Failed to update notice' });
	}
};

export const logoutSupplier = async (req, res) => {
	try {
		res.clearCookie('supplier_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
		});
		return res.json({ success: true, message: 'Logged Out' });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};


export const sendSupplierVerifyOtp = async (req, res) => {
	try {
		const supplierId = req.user.id;
		const supplier = await supplierModel.findById(supplierId);
		if (supplier.isAccountVerified) {
			return res.json({ success: false, message: 'Account Already Verified' });
		}
		const otp = String(Math.floor(100000 + Math.random() * 900000));
		supplier.verifyOtp = otp;
		supplier.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
		await supplier.save();
		const mailOptions = {
			from: process.env.SENDER_EMAIL,
			to: supplier.email,
			subject: 'Supplier Account Verification OTP',
			html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", supplier.email)
		};
		await transporter.sendMail(mailOptions);
		res.json({ success: true, message: 'Verification OTP sent to your email' });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};


export const verifySupplierEmail = async (req, res) => {
	const { otp } = req.body;
	const supplierId = req.user.id;
	if (!otp) {
		return res.json({ success: false, message: 'Missing Details' });
	}
	try {
		const supplier = await supplierModel.findById(supplierId);
		if (!supplier) {
			return res.json({ success: false, message: 'Supplier Not Found' });
		}
		if (supplier.verifyOtp === '' || supplier.verifyOtp !== otp) {
			return res.json({ success: false, message: 'Invalid OTP' });
		}
		if (supplier.verifyOtpExpireAt < Date.now()) {
			return res.json({ success: false, message: 'OTP is Expired' });
		}
		supplier.isAccountVerified = true;
		supplier.verifyOtp = '';
		supplier.verifyOtpExpireAt = 0;
		await supplier.save();
		return res.json({ success: true, message: 'Email Verified Successfully' });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};


export const sendSupplierResetOtp = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		return res.json({ success: false, message: 'Email is Required' });
	}
	try {
		const supplier = await supplierModel.findOne({ email });
		if (!supplier) {
			return res.json({ success: false, message: 'Supplier not Found' });
		}
		const otp = String(Math.floor(100000 + Math.random() * 900000));
		supplier.resetOtp = otp;
		supplier.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
		await supplier.save();
		const mailOptions = {
			from: process.env.SENDER_EMAIL,
			to: supplier.email,
			subject: 'Supplier Password Reset OTP',
			html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", supplier.email)
		};
		await transporter.sendMail(mailOptions);
		return res.json({ success: true, message: 'OTP has been sent to your email' });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};


export const resetSupplierPassword = async (req, res) => {
	const { email, otp, newPassword } = req.body;
	if (!email || !otp || !newPassword) {
		return res.json({ success: false, message: 'Email, OTP and new Password Required' });
	}
	try {
		const supplier = await supplierModel.findOne({ email });
		if (!supplier) {
			return res.json({ success: false, message: 'Supplier Not Available' });
		}
		if (supplier.resetOtp === '' || supplier.resetOtp !== otp) {
			return res.json({ success: false, message: 'Invalid OTP' });
		}
		if (supplier.resetOtpExpireAt < Date.now()) {
			return res.json({ success: false, message: 'OTP expired' });
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		supplier.password = hashedPassword;
		supplier.resetOtp = '';
		supplier.resetOtpExpireAt = 0;
		await supplier.save();
		return res.json({ success: true, message: 'Password has been changed successfully' });
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};
