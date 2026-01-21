import { User } from '../models/user.model.js';

import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Get User Profile Details

export const getProfile = asyncHandler(async (req, res) => {
    const responseData = {
        user:req.user
    }
    return res.status(200).json(new ApiResponse(200,responseData,"User profile fetched successfully"))
});

// Update User Profile Details

export const updateProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (name) {
        req.user.name = name;
    }

    await req.user.save();
    
    const responseData = {
        user:req.user
    }

    return res.status(200).json(new ApiResponse(200,responseData,"User profile updated successfully"))
});



// Update User Profile Picture

export const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400,"Avatar image is required")
    }


    // Delete previous avatar from cloudinary if exists
    if (req.user?.avatarPublicId) {
        await cloudinary.uploader.destroy(req.user.avatarPublicId);
    }

    // Upload new avatar to cloudinary

    req.user.avatar = req.file.path;
    req.user.avatarPublicId = req.file.filename;

    await req.user.save();

    const responseData = {
        avatar:req.user.avatar
    }

    return res.status(200).json(new ApiResponse(200,responseData,"Profile picture updated successfully"))
});

// Delete Profile picture

export const deleteAvatar = asyncHandler(async (req, res) => {
    if (!req.user?.avatarPublicId) {
        throw new ApiError(400,"No profile picture to delete")
    }

    await cloudinary.uploader.destroy(req.user.avatarPublicId)

    req.user.avatar = "https://images.unsplash.com/vector-1738312097380-45562da00459?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    req.user.avatarPublicId = undefined;
    await req.user.save();

    return res.status(200).json(new ApiResponse(200,{},"Profile picture removed successfully"))
})