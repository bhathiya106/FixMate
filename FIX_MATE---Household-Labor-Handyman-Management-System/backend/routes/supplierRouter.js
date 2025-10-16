

import express from 'express';
import supplierAuth from '../middleware/supplierAuth.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getSupplierData,
  registerSupplier,
  loginSupplier,
  logoutSupplier,
  sendSupplierVerifyOtp,
  verifySupplierEmail,
  sendSupplierResetOtp,
  resetSupplierPassword,
  getAllSuppliers,
  deleteSupplier,
  updateSupplierProfile,
  verifySupplier
} from '../controllers/suppplierController.js';

const supplierRouter = express.Router();

// Admin verify supplier endpoint
supplierRouter.put('/verify/:id', verifySupplier);

supplierRouter.put('/update-profile', supplierAuth, updateSupplierProfile);
supplierRouter.get('/all', getAllSuppliers);
supplierRouter.delete('/:id', deleteSupplier);
supplierRouter.post('/register', registerSupplier);
supplierRouter.post('/login', loginSupplier);
supplierRouter.post('/logout', logoutSupplier);
supplierRouter.post('/send-verify-otp', supplierAuth, sendSupplierVerifyOtp);
supplierRouter.post('/verify-account', supplierAuth, verifySupplierEmail);
supplierRouter.post('/send-reset-otp', sendSupplierResetOtp);
supplierRouter.post('/reset-password', resetSupplierPassword);
supplierRouter.get('/data', supplierAuth, getSupplierData);

// Admin ban/unban and notice
import { adminBanSupplierByEmail, adminUnbanSupplierByEmail, adminSendSupplierNotice, getMySupplierNotices, markSupplierNoticeRead } from '../controllers/suppplierController.js';
supplierRouter.post('/admin/ban', protect, admin, adminBanSupplierByEmail);
supplierRouter.post('/admin/unban', protect, admin, adminUnbanSupplierByEmail);
supplierRouter.post('/admin/notice', protect, admin, adminSendSupplierNotice);

// Supplier notices
supplierRouter.get('/notices', supplierAuth, getMySupplierNotices);
supplierRouter.post('/notices/:id/read', supplierAuth, markSupplierNoticeRead);

export default supplierRouter;
