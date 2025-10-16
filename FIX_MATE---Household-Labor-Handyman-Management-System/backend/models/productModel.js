import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers", required: true },
  createdAt: { type: Date, default: Date.now }
});

const productModel = mongoose.models.product || mongoose.model("products", productSchema);

export default productModel;
