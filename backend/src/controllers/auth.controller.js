import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Validate: must be a base64 image
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const mimeMatch = profilePic.match(/^data:(image\/\w+);base64,/);
    if (!mimeMatch || !validMimeTypes.includes(mimeMatch[1])) {
      return res.status(400).json({
        message: "Invalid image format. Accepted: JPEG, PNG, WebP, GIF",
      });
    }

    // Validate: check base64 size
    const base64Data = profilePic.split(",")[1];
    const sizeInBytes = Buffer.byteLength(base64Data, "base64");
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (sizeInBytes > maxSize) {
      return res.status(413).json({ message: "Image too large. Max 2MB." });
    }

    // Delete old image on Cloudinary if exists
    const currentUser = await User.findById(userId);
    if (currentUser.profilePicId) {
      await cloudinary.uploader.destroy(currentUser.profilePicId);
    }

    // Upload with transformation (Facebook-style face detection crop)
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "chat-app/avatars",
      public_id: `${userId}_${Date.now()}`,
      overwrite: true,
      transformation: [
        {
          width: 500,
          height: 500,
          crop: "fill",
          gravity: "face",
          quality: "auto",
        },
      ],
      eager: [
        {
          width: 80,
          height: 80,
          crop: "fill",
          gravity: "face",
          quality: "auto",
        },
        {
          width: 200,
          height: 200,
          crop: "fill",
          gravity: "face",
          quality: "auto",
        },
      ],
      eager_async: true,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
        profilePicId: uploadResponse.public_id,
      },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    if (!currentUser.profilePic) {
      return res.status(400).json({ message: "No profile picture to remove" });
    }

    // Delete from Cloudinary
    if (currentUser.profilePicId) {
      await cloudinary.uploader.destroy(currentUser.profilePicId);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: "", profilePicId: "" },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in remove profile pic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
