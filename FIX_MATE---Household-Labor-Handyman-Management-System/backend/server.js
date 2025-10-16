import contactRouter from './routes/contactRouter.js';
import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import supplierRouter from './routes/supplierRouter.js';
import deliveryRouter from './routes/deliveryRoute.js';

import vendorRouter from './routes/vendorRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import imageUploadRouter from './routes/imageUploadRouter.js';
import supplyOrderRoutes from './routes/supplyOrderRoutes.js';
import productRouter from './routes/productRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import vendorReviewRouter from './routes/vendorReviewRouter.js';
import paymentRouter from './routes/paymentRouter.js';
import adminRouter from './routes/adminRoute.js';

import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}));

app.get('/', (req, res)=>res.send("API WORKING"))




app.use('/api/supply-orders', supplyOrderRoutes);
import path from "path";
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/vendor', vendorRouter);

app.use('/api/upload', imageUploadRouter); 
app.use('/api/contact', contactRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/vendor-reviews', vendorReviewRouter);
app.use('/api/payment', paymentRouter);
// Removed duplicate productRouter mounts
app.use('/api/supplier', productRouter); 

app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);

app.listen(port, ()=> console.log(`Server started on PORT:${port}`));