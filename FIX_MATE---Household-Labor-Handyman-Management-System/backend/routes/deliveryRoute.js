import express from 'express';
import {
  registerDelivery,
  loginDelivery,
  logoutDelivery,
  getDeliveryProfile,
  updateDeliveryProfile,
  getAllDeliveryDrivers,
  adminDeleteDriver,
  adminBanDriverByEmail,
  adminUnbanDriverByEmail,
  adminSendDriverNotice,
  getMyNotices,
  markNoticeRead
} from '../controllers/deliveryController.js';
import deliveryAuth from '../middleware/deliveryAuth.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const deliveryRouter = express.Router();

// Public routes
deliveryRouter.post('/register', registerDelivery);
deliveryRouter.post('/login', loginDelivery);
deliveryRouter.post('/logout', logoutDelivery);

// Protected routes (require authentication)
deliveryRouter.get('/profile', deliveryAuth, getDeliveryProfile);
deliveryRouter.put('/profile', deliveryAuth, updateDeliveryProfile);

// Admin routes
deliveryRouter.get('/admin/all', protect, admin, getAllDeliveryDrivers);

// Public routes for suppliers
deliveryRouter.get('/drivers', getAllDeliveryDrivers);

// Admin management routes (protected)
deliveryRouter.delete('/admin/:id', protect, admin, adminDeleteDriver);
deliveryRouter.post('/admin/ban', protect, admin, adminBanDriverByEmail);
deliveryRouter.post('/admin/unban', protect, admin, adminUnbanDriverByEmail);
deliveryRouter.post('/admin/notice', protect, admin, adminSendDriverNotice);

// Driver notice routes
deliveryRouter.get('/notices', deliveryAuth, getMyNotices);
deliveryRouter.post('/notices/:id/read', deliveryAuth, markNoticeRead);

export default deliveryRouter;