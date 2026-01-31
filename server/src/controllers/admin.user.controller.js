import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// GET ALL USERS

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("name email role isBlocked createdAt");

    if (!users) {
        throw new ApiError(404,"No users found")
    }

    const responseData = {
        count: users.length,
        users
    }
    return res.status(200).json(new ApiResponse(200,users,"All users fetched successfully"))
});

// BLOCK USER

export const blockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (user.role === "admin") {
        throw new ApiError(403,"Admin cannot be blocked")
    }

    user.isBlocked = true;
    user.blockedAt = new Date();
    user.blockedReason = req.body.reason;

    await user.save();

    return res.status(200).json(new ApiResponse(200,{},"User blocked successfully"))
});



// UNBLOCK USER

export const unblockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user || !user.isBlocked) {
        throw new ApiError(404,"User not found or user already unblocked")
    }

    user.isBlocked = false;
    user.blockedAt = new Date();
    user.blockedReason = undefined;

    await user.save();


    return res.status(200).json(new ApiResponse(200,{},"User unblocked successfully"))
})