import express from 'express';
import jwt from 'jsonwebtoken';
import { isAuthenticated, login, logout, register, resetPassword, sendRestOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth, sendVerifyOtp);
authRouter.post('/verify-account',userAuth, verifyEmail);
authRouter.get('/is-auth',userAuth, isAuthenticated);
authRouter.post('/send-reset-otp',sendRestOtp);
authRouter.post('/reset-password',resetPassword);

export default authRouter;

// Dev-only: simple admin login using env credentials, sets an admin token cookie
// Body: { username, password }
authRouter.post('/admin-login', (req, res) => {
	try {
		const { username, password } = req.body || {};
		const envUser = (process.env.ADMIN_USERNAME || 'Admin@fixmate');
		const envPass = (process.env.ADMIN_PASSWORD || 'admin123');

		if (username !== envUser || password !== envPass) {
			return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
		}

		// Use a placeholder 24-hex string to avoid ObjectId cast errors downstream
		const token = jwt.sign({ id: '000000000000000000000000', email: envUser, admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });

			res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

			return res.json({ success: true, role: 'admin', token });
	} catch (e) {
		console.error('admin-login error', e);
		return res.status(500).json({ success: false, message: 'Server error' });
	}
});

