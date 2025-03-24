import express from "express";
import { saveProfile, getProfile, deleteProfile } from "../controllers/AccountController.js";

const router = express.Router();

// ✅ Route to save or update profile
router.post("/api/profile", saveProfile);

// ✅ Route to get profile by contact number instead of email
router.get("/profile/:contactNo", getProfile);

// ✅ Route to delete profile by contact number instead of email
router.delete("/profile/:contactNo", deleteProfile);

export default router;
