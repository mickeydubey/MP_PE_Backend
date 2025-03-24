import UserProfile from "../models/AccountSetting.js";
import bcrypt from "bcrypt";

// ✅ Get user profile data by email
export const getProfile = async (req, res) => {
  try {
    const { contactNo } = req.params;


    const user = await UserProfile.findOne({ contact: contactNo }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// 🔥 Create or update user profile
export const saveProfile = async (req, res) => {
    try {
      console.log("Received profile data:", req.body);
  
      const { firstName, lastName, contactNo, currentPassword, newPassword, profileImage } = req.body;
  
      if (!contactNo) {
        return res.status(400).json({ message: "Contact number is required." });
      }
  
      let user = await UserProfile.findOne({ contact: contactNo });
  
      if (user) {
        console.log("User found:", user);
  
        if (!(await bcrypt.compare(currentPassword, user.password))) {
          console.log("Current password incorrect");
          return res.status(400).json({ message: "Current password is incorrect." });
        }
  
        user.firstName = firstName;
        user.lastName = lastName;
        user.contact = contactNo;
        user.profileImage = profileImage || user.profileImage;
  
        if (newPassword) {
          user.password = await bcrypt.hash(newPassword, 10);
        }
  
        await user.save();
        console.log("Profile updated successfully!");
        return res.status(200).json({ message: "Profile updated successfully." });
      }
  
      console.log("Creating new user profile...");
  
      const hashedPassword = await bcrypt.hash(newPassword || currentPassword, 10);
  
      const newUser = new UserProfile({
        firstName,
        lastName,
        contact: contactNo,
        password: hashedPassword,
        profileImage,
      });
  
      await newUser.save();
      console.log("Profile created successfully!");
      res.status(201).json({ message: "Profile created successfully." });
    } catch (error) {
      console.error("🔥 Error saving profile:", error);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  };
  
// 🚨 Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserProfile.findOneAndDelete({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
