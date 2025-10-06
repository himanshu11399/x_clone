import express from "express";
import { getPosts,getPost,getuserPosts,createPost,likePost,deletePost } from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";
import {protectedRoute} from "../middleware/auth.middleware.js"

const router=express.Router();

//public routes
router.get("/",getPosts);
router.get("/:postId",getPost);
router.get("/user/:username",getuserPosts);

//protected routes
router.post("/",protectedRoute,upload.single("image"),createPost);
router.post("/:postId/like",protectedRoute,likePost);
router.delete("/:postId/delete",protectedRoute,deletePost)


export default router;