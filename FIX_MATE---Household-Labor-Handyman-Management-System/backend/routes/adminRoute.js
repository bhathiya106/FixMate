import express from 'express';
import {
    getUsersCount,
    getSuppliersCount,
    getVendorsCount,
    getDeliveryDriversCount,
    getProductsCount,
    getAdminRevenue
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes with authentication and admin middleware
router.use(protect);
router.use(admin);

// Dashboard statistics routes
router.get('/users/count', getUsersCount);
router.get('/supplier/count', getSuppliersCount);
router.get('/vendor/count', getVendorsCount);
router.get('/delivery/count', getDeliveryDriversCount);
router.get('/products/count', getProductsCount);
router.get('/revenue', getAdminRevenue);

export default router;