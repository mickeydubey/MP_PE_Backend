import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String},
  contact: { type: String, required: true,unique:true },
  password: { type: String },
  profileImage: { type: String, default: "default-profile.png" }, // URL or path to image
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 🔥 Automatically update 'updatedAt' before saving
userProfileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
