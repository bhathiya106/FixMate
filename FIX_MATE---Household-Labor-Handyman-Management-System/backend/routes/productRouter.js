
import express from "express";
console.log('productRouter loaded');
import supplierAuth from "../middleware/supplierAuth.js";
import multer from "multer";
import { addProduct, getSupplierProducts, deleteProduct, getAllProducts, adminDeleteProduct } from "../controllers/productController.js";

const router = express.Router();

// Admin: Get all products
router.get("/admin/all", getAllProducts);
// Admin: Delete any product
router.delete("/admin/:id", adminDeleteProduct);

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/products", supplierAuth, upload.single("image"), addProduct);




// /products route must come BEFORE /:id
router.get("/products", (req, res, next) => {
  console.log('ROUTE /api/supplier/products HIT');
  next();
}, supplierAuth, getSupplierProducts);

// Public: Get single product by ID with supplier info
router.get("/:id", async (req, res) => {
	try {
		const product = await (await import("../models/productModel.js")).default
			.findById(req.params.id)
				.populate('supplier', 'name businessName location profileImageUrl email isAccountVerified');
		if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
			// Hide if supplier not verified or is banned
			const banned = await (await import('../models/bannedEmailModel.js')).default.findOne({ type: 'supplier', email: (product.supplier?.email || '').toLowerCase() });
			if (!product.supplier || product.supplier.isAccountVerified !== true || banned) {
			return res.status(403).json({ success: false, message: 'Supplier not verified' });
		}
		res.json({ success: true, product });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});


router.delete("/products/:id", supplierAuth, deleteProduct);

export default router;
