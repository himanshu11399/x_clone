import asyncHandler from "express-async-handler";
import User from "../models/user.model.js"
import { clerkClient, getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js"

export const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not Found" });

    res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const user = await User.findByOneAndUpdate({ clerkId: userId }, req.body, { new: true });

    if (!user) return res.status(404).json({ error: "User not Found" });
    res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
        return res.status(200).json({ user: existingUser, message: "User already exist. Please try Sign In" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
        profilePicture: clerkUser.imageUrl || ""
    };

    const user = await User.create(userData);
    res.status(201).json({ user, message: "User created sucessfully" });
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
})


export const followUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params;

    if (userId === targetUserId) return res.status(400).json("You cannot follow Yourself!!");

    const curruser = await User.findOne({ clerkId: userId });
    const targetuser = await User.findById(targetUserId);

    if (!curruser || !targetuser) return res.status(400).json("User not Found !!");

    const isFollowing = curruser.following.includes(targetUserId);


    if (isFollowing) {
        //Unfollow user
        await User.findByIdAndUpdate(curruser._id, {
            $pull: { following: targetUserId },
        });
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: curruser._id },
        });

    } else {
        await User.findByIdAndUpdate(curruser._id, {
            $push: { following: targetUserId },
        });
        await User.findByIdAndUpdate(targetUserId, {
            $push: { followers: curruser._id },
        });
    }

    //create Notification
    if (!isFollowing) {
        await Notification.create({
            from: curruser._id,
            to: targetUserId,
            type: "follow"
        });
    }

    res.status(200).json({
        message: isFollowing ? "User Unfollowed Sucessfully" : "User followed Sucessfully",
    });


});

