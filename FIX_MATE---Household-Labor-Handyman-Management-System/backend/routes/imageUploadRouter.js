import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import supplierModel from '../models/supplierModel.js';


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const { userType, userId } = req.body;
    if (!req.file || !userType || !userId) {
      return res.status(400).json({ success: false, message: 'Missing file or context' });
    }
    
    const streamifier = require('streamifier');
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: `${userType}-profiles`,
          resource_type: 'image',
        }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req.file.buffer);

  
    if (userType === 'supplier') {
      const supplier = await supplierModel.findById(userId);
      if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
    
      if (supplier.profileImagePublicId) {
        try { await cloudinary.uploader.destroy(supplier.profileImagePublicId); } catch {}
      }
      supplier.profileImageUrl = result.secure_url;
      supplier.profileImagePublicId = result.public_id;
      await supplier.save();
      return res.json({ success: true, profileImageUrl: result.secure_url });
    }
    

    res.status(400).json({ success: false, message: 'Unknown user type' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
