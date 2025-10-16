import jwt from 'jsonwebtoken';

// Middleware to authenticate delivery drivers
const deliveryAuth = async (req, res, next) => {
  try {
    const { delivery_token } = req.cookies;
    
    if (!delivery_token) {
      return res.json({ success: false, message: "Not authorized. Please login." });
    }

    const decoded = jwt.verify(delivery_token, process.env.JWT_SECRET);
    req.deliveryId = decoded.id;
    next();
  } catch (error) {
    console.error('Delivery auth error:', error);
    res.json({ success: false, message: "Invalid token. Please login again." });
  }
};

export default deliveryAuth;