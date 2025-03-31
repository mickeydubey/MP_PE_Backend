import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String },
  phone: {
    type: String,
    required: function () {
      return this.role === "user";
    },
  },
  user_id: { type: String, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  admin_id: { type: String },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  // 🔥 Link to UserProfile model
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
