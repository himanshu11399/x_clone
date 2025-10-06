import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {getnotification,deletenotification} from "../controllers/notification.controller.js"

const router=express.Router();

router.get("/",protectedRoute,getnotification);
router.delete("/:notificationId",protectedRoute,deletenotification);

export default router;