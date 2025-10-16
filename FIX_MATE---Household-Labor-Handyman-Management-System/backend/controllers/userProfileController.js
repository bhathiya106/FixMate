import userModel from "../models/userModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer setup for profile image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("uploads", "user-profiles");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + "-profile" + ext);
  },
});

export const uploadUserProfileImage = multer({ storage }).single("profileImage");

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, birthday } = req.body;
    let profileImageUrl = undefined;
    if (req.file) {
      profileImageUrl = `/uploads/user-profiles/${req.file.filename}`;
    }
    const updateFields = { name, phone, address, birthday };
    if (profileImageUrl) updateFields.profileImageUrl = profileImageUrl;
    const user = await userModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
