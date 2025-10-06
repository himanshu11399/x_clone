import { getAuth } from "@clerk/express";
import asyncHandler from "express-async-handler"
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";


export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture");

    res.status(200).json({ comments });
})

export const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = getAuth(req);
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Comments content is required" });
    }

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
        res.status(400).json("User not Found");
    }

    const comment = await Comment.create({
        user: user._id,
        post: postId,
        content,
    });

    //Sync comment with the posts
    await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
    });

    //create notification if not make comment on your post
    if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            type: "comment",
            post: postId,
            comment: comment._id,
        });
    }

    res.status(201).json({ comment });

})

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentsId } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const comment = await Comment.findById(commentsId);

    if (!user) {
        res.status(400).json("User not Found");
    }
    if (!comment) {
        res.status(400).json("Comment Not found");
    }

    if (user._id.toString() !== comment.user.toString()) {
        return res.status(403).json({ error: "You can only delete your comment" });
    }

    //remove the comment from the post
    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentsId },
    });

    //delete comment
    await Comment.findByIdAndDelete(commentsId);

    res.status(200).json({ message: "Comments deleted Sucessfully" });

})