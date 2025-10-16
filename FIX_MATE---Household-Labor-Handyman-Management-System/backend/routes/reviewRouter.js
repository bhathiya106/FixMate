import express from 'express';

import { addReview, getProductReviews, getUserReviews, getSupplierReviews, editReview, deleteReview, addOrUpdateSupplierReply, deleteSupplierReply } from '../controllers/reviewController.js';
import userAuth from '../middleware/userAuth.js';
import supplierAuth from '../middleware/supplierAuth.js';


const reviewRouter = express.Router();

// Add a new review (requires authentication)
reviewRouter.post('/add', userAuth, addReview);

// Get reviews for a specific product
reviewRouter.get('/product/:productId', getProductReviews);


// Get reviews for all products by a supplier
reviewRouter.get('/supplier/:supplierId', getSupplierReviews);


// Get reviews by a specific user
reviewRouter.get('/user/:userId', getUserReviews);

// Edit a review (requires authentication)
reviewRouter.put('/:reviewId', userAuth, editReview);

// Delete a review (requires authentication)
reviewRouter.delete('/:reviewId', userAuth, deleteReview);


// Supplier can add/update a reply to a product review
reviewRouter.post('/:reviewId/supplier-reply', supplierAuth, addOrUpdateSupplierReply);

// Supplier can delete their reply
reviewRouter.delete('/:reviewId/supplier-reply', supplierAuth, deleteSupplierReply);

export default reviewRouter;