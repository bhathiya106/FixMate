import express from 'express';
import {
  createSupplyOrder,
  getAllSupplyOrders,
  getSupplyOrdersByUser,
  getSupplyOrdersBySupplier,
  updateSupplyOrderStatus,
  deleteSupplyOrder,
  updateSupplyOrderDetails,
  assignDeliveryToOrder,
  cancelDeliveryAssignment,
  acceptDeliveryOrder,
  completeDeliveryOrder
} from '../controllers/supplyOrderController.js';

const router = express.Router();

// Create a new supply order
router.post('/', createSupplyOrder);

// Get all supply orders (admin)
router.get('/', getAllSupplyOrders);

// Get supply orders by user
router.get('/user/:userId', getSupplyOrdersByUser);

// Get supply orders by supplier
router.get('/supplier/:supplierId', getSupplyOrdersBySupplier);

// Update supply order status
router.patch('/:orderId/status', updateSupplyOrderStatus);

// Update supply order details
router.put('/:orderId', updateSupplyOrderDetails);

// Delete supply order
router.delete('/:orderId', deleteSupplyOrder);

// Delivery-related routes
router.patch('/:orderId/assign-delivery', assignDeliveryToOrder);
router.patch('/:orderId/cancel-delivery', cancelDeliveryAssignment);
router.patch('/:orderId/accept-delivery', acceptDeliveryOrder);
router.patch('/:orderId/complete-delivery', completeDeliveryOrder);

export default router;
