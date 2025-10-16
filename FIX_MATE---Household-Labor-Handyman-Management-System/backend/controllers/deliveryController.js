import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import deliveryModel from '../models/deliveryModel.js';
import BannedEmail from '../models/bannedEmailModel.js';
import DeliveryNotice from '../models/deliveryNoticeModel.js';

// Register a new delivery driver
const registerDelivery = async (req, res) => {
  try {
    const { name, rate, operatingArea, phone, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !rate || !operatingArea || !phone || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Check if email already exists
    const existingDelivery = await deliveryModel.findOne({ email });
    if (existingDelivery) {
      return res.json({ success: false, message: "Email already exists" });
    }

    // Check banned list
    const banned = await BannedEmail.findOne({ email: email.toLowerCase(), type: 'delivery' });
    if (banned) {
      return res.json({ success: false, message: "This email is banned from registering as delivery driver" });
    }

    // Validate rate
    if (rate < 0) {
      return res.json({ success: false, message: "Rate must be a positive number" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new delivery driver
    const newDelivery = new deliveryModel({
      name,
      rate: Number(rate),
      operatingArea,
      phone,
      email,
      password: hashedPassword
    });

    const delivery = await newDelivery.save();

    // Generate JWT token
    const token = jwt.sign({ id: delivery._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set cookie and send response
    res.cookie('delivery_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: "Delivery driver registered successfully",
      delivery: {
        id: delivery._id,
        name: delivery.name,
        email: delivery.email,
        rate: delivery.rate,
        operatingArea: delivery.operatingArea,
        phone: delivery.phone
      }
    });

  } catch (error) {
    console.error('Register delivery error:', error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// Login delivery driver
const loginDelivery = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    // Find delivery driver by email
    const delivery = await deliveryModel.findOne({ email });
    if (!delivery) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check banned list (blocks login too per requirements)
    const banned = await BannedEmail.findOne({ email: email.toLowerCase(), type: 'delivery' });
    if (banned) {
      return res.json({ success: false, message: "This account has been banned. Contact admin." });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, delivery.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: delivery._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set cookie and send response
    res.cookie('delivery_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: "Login successful",
      delivery: {
        id: delivery._id,
        name: delivery.name,
        email: delivery.email,
        rate: delivery.rate,
        operatingArea: delivery.operatingArea,
        phone: delivery.phone,
        profileImageUrl: delivery.profileImageUrl,
        location: delivery.location,
        bio: delivery.bio,
        isAvailable: delivery.isAvailable,
        totalDeliveries: delivery.totalDeliveries
      }
    });

  } catch (error) {
    console.error('Login delivery error:', error);
    res.json({ success: false, message: "Login failed" });
  }
};

// Logout delivery driver
const logoutDelivery = async (req, res) => {
  try {
    res.clearCookie('delivery_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout delivery error:', error);
    res.json({ success: false, message: "Logout failed" });
  }
};

// Get delivery driver profile
const getDeliveryProfile = async (req, res) => {
  try {
    const delivery = await deliveryModel.findById(req.deliveryId).select('-password');
    if (!delivery) {
      return res.json({ success: false, message: "Delivery driver not found" });
    }
    const banned = await BannedEmail.findOne({ email: (delivery.email || '').toLowerCase(), type: 'delivery' });

    res.json({
      success: true,
      delivery: {
        id: delivery._id,
        name: delivery.name,
        email: delivery.email,
        rate: delivery.rate,
        operatingArea: delivery.operatingArea,
        phone: delivery.phone,
        profileImageUrl: delivery.profileImageUrl,
        location: delivery.location,
        bio: delivery.bio,
        isAvailable: delivery.isAvailable,
        totalDeliveries: delivery.totalDeliveries,
        isBanned: !!banned,
        createdAt: delivery.createdAt
      }
    });
  } catch (error) {
    console.error('Get delivery profile error:', error);
    res.json({ success: false, message: "Failed to get profile" });
  }
};

// Update delivery driver profile
const updateDeliveryProfile = async (req, res) => {
  try {
    const { name, rate, operatingArea, phone, location, bio, isAvailable, profileImageUrl } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (rate) updateData.rate = Number(rate);
    if (operatingArea) updateData.operatingArea = operatingArea;
    if (phone) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;
    
    updateData.updatedAt = new Date();

    const delivery = await deliveryModel.findByIdAndUpdate(
      req.deliveryId,
      updateData,
      { new: true }
    ).select('-password');

    if (!delivery) {
      return res.json({ success: false, message: "Delivery driver not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      delivery: {
        id: delivery._id,
        name: delivery.name,
        email: delivery.email,
        rate: delivery.rate,
        operatingArea: delivery.operatingArea,
        phone: delivery.phone,
        profileImageUrl: delivery.profileImageUrl,
        location: delivery.location,
        bio: delivery.bio,
        isAvailable: delivery.isAvailable,
        totalDeliveries: delivery.totalDeliveries
      }
    });
  } catch (error) {
    console.error('Update delivery profile error:', error);
    res.json({ success: false, message: "Failed to update profile" });
  }
};

// Get all delivery drivers (for admin)
const getAllDeliveryDrivers = async (req, res) => {
  try {
    const deliveryDrivers = await deliveryModel.find({}).select('-password');
    res.json({
      success: true,
      deliveryDrivers,
      count: deliveryDrivers.length
    });
  } catch (error) {
    console.error('Get all delivery drivers error:', error);
    res.json({ success: false, message: "Failed to get delivery drivers" });
  }
};

export {
  registerDelivery,
  loginDelivery,
  logoutDelivery,
  getDeliveryProfile,
  updateDeliveryProfile,
  getAllDeliveryDrivers
};

// Admin actions
export const adminDeleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deliveryModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Driver not found' });
    return res.json({ success: true, message: 'Driver removed' });
  } catch (err) {
    console.error('Admin delete driver error:', err);
    return res.status(500).json({ success: false, message: 'Failed to remove driver' });
  }
};

export const adminBanDriverByEmail = async (req, res) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const record = await BannedEmail.findOneAndUpdate(
      { email: email.toLowerCase(), type: 'delivery' },
      { $set: { reason: reason || '', createdBy: req.user?.email || 'admin' } },
      { upsert: true, new: true }
    );
    return res.json({ success: true, message: 'Driver banned', ban: record });
  } catch (err) {
    console.error('Admin ban driver error:', err);
    return res.status(500).json({ success: false, message: 'Failed to ban driver' });
  }
};

export const adminUnbanDriverByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    await BannedEmail.deleteOne({ email: email.toLowerCase(), type: 'delivery' });
    return res.json({ success: true, message: 'Driver unbanned' });
  } catch (err) {
    console.error('Admin unban driver error:', err);
    return res.status(500).json({ success: false, message: 'Failed to unban driver' });
  }
};

export const adminSendDriverNotice = async (req, res) => {
  try {
    const { driverId, message } = req.body;
    if (!driverId || !message) return res.status(400).json({ success: false, message: 'driverId and message are required' });
    const driver = await deliveryModel.findById(driverId);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    const notice = await DeliveryNotice.create({ driverId, message, createdBy: req.user?.email || 'admin' });
    return res.json({ success: true, message: 'Notice sent', notice });
  } catch (err) {
    console.error('Admin send notice error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send notice' });
  }
};

// Driver endpoints for notices
export const getMyNotices = async (req, res) => {
  try {
    const notices = await DeliveryNotice.find({ driverId: req.deliveryId }).sort({ createdAt: -1 });
    return res.json({ success: true, notices });
  } catch (err) {
    console.error('Get notices error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get notices' });
  }
};

export const markNoticeRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await DeliveryNotice.findOneAndUpdate(
      { _id: id, driverId: req.deliveryId },
      { $set: { read: true } },
      { new: true }
    );
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    return res.json({ success: true, message: 'Notice marked as read', notice });
  } catch (err) {
    console.error('Mark notice read error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update notice' });
  }
};