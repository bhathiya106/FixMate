import express from 'express';
import vendorAuth from '../middleware/vendorAuth.js';
import upload from '../middleware/vendorUpload.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import {
	registerVendor,
	loginVendor,
	logoutVendor,
	getVendorData,
	updateVendorProfile,
	getVendorsByCategory,
	getVendorById,
	getAllVendors,
	deleteVendor,
	verifyVendor,
	adminBanVendorByEmail,
	adminUnbanVendorByEmail,
	adminSendVendorNotice,
	getMyVendorNotices,
	markVendorNoticeRead
,
	sendVendorResetOtp,
	resetVendorPassword
} from '../controllers/vendorContoller.js';

const vendorRouter = express.Router();

// Admin: Verify vendor
vendorRouter.put('/verify/:id', verifyVendor);

vendorRouter.get('/all', getAllVendors);

vendorRouter.delete('/:id', deleteVendor);


vendorRouter.post('/register', registerVendor);
vendorRouter.post('/login', loginVendor);
vendorRouter.post('/logout', logoutVendor);
// Password reset for vendors
vendorRouter.post('/send-reset-otp', sendVendorResetOtp);
vendorRouter.post('/reset-password', resetVendorPassword);
vendorRouter.get('/data', vendorAuth, getVendorData);

vendorRouter.put('/profile', vendorAuth, upload, updateVendorProfile);


vendorRouter.get('/category/:category', getVendorsByCategory);

vendorRouter.get('/category/vendor/:id', getVendorById);
// Admin ban/unban and notice
vendorRouter.post('/admin/ban', protect, admin, adminBanVendorByEmail);
vendorRouter.post('/admin/unban', protect, admin, adminUnbanVendorByEmail);
vendorRouter.post('/admin/notice', protect, admin, adminSendVendorNotice);

// Vendor notices
vendorRouter.get('/notices', vendorAuth, getMyVendorNotices);
vendorRouter.post('/notices/:id/read', vendorAuth, markVendorNoticeRead);
export default vendorRouter;
