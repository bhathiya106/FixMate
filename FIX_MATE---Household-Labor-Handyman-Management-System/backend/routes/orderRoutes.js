
import express from 'express';
import { createOrder, getOrdersByVendor, getOrdersByUser, updateOrderStatus, deleteOrder, updateOrderDetails } from '../controllers/orderController.js';

const router = express.Router();

// Update service order details
router.put('/:orderId', updateOrderDetails);


router.post('/', createOrder);


router.get('/vendor/:vendorId', getOrdersByVendor);
router.get('/user/:userId', getOrdersByUser);


router.patch('/:orderId/status', updateOrderStatus);
router.delete('/:orderId', deleteOrder);

export default router;
