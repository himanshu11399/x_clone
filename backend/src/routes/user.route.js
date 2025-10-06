import express from "express";
import { getUserProfile,updateProfile,syncUser,getCurrentUser,followUser } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";


const router=express.Router();

router.get("/profile/:username",getUserProfile);

router.post("/sync",protectedRoute,syncUser);
router.post("/me",protectedRoute,getCurrentUser);
router.post("/follow/:targetUserId",protectedRoute,followUser);

//update the profile
router.put("/profile",protectedRoute,updateProfile);

export default router;


