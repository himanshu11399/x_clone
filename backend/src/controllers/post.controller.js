import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudnary.js";
import { getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js"

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    res.status(200).json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    if (!post) return res.status(404).json({ error: "Post Not Found" });
    res.status(200).json({ post });

});

export const getuserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json("No User Found");

    const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    res.status(200).json({ posts });

});

export const createPost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    if (!content?.trim() && !imageFile) {
        return res.status(500).json({ error: "Post must Contain atleast text or image" });
    };

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json("No user Found");

    let imageUrl = "";

    if (imageFile) {
        try {
            //convert buffer to base64 for cloudnary
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "special_media_posts",
                resource_type: "image",
                transformation: [
                    { width: 800, height: 600, crop: "limit" },
                    { quality: "auto" },
                    { format: "auto" },
                ]
            });
            imageUrl = uploadResponse.secure_url;

        } catch (uploadError) {
            console.log("Error in Image upload");
            return res.status(404).json({ error: "Failed to load the image" })
        }
    }

    const post = await Post.create({
        user: user._id,
        content: content || "",
        image: imageUrl,
    });

    res.status(200).json({ post });

});

export const likePost = asyncHandler(async (req, res) => {
    const userid = getAuth(req);
    const { postId } = req.params;

    const post = Post.findById(postId);
    const user = User.findOne({ clerkId: userid });

    if (!user) {
        return res.status(404).json("User Not Found");
    }
    if (!post) {
        return res.status(500).json("Post Not found!!");
    }

    const islike = post.likes.includes(user._id);

    if (islike) {
        //unlike
        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: user._id },
        });
    } else {
        //like
        await Post.findByIdAndUpdate(postId, {
            $push: { likes: user._id },
        });
    }

    if (!islike) {
        Notification.create({
            from: user.id,
            to: post.user,
            type: "like",
            post: postId,
        });
    };

    res.status(200).json({
        message: islike ? "Post unlike Sucessfully" : "Post Like sucessfully",
    });

});

export const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findByIdAndDelete(postId)

    if (!user || !post) return res.status(403).json({ error: "User or Post not found" });

    if (post.user.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "You can only delete You post" });
    }

    //delete all comments
    await Comment.deleteMany({ post: postId });

    //delete all post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted Sucessfully" });

});

