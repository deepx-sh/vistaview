import sendEmail from "../config/mailer.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { accountBlockedTemplate } from "../utils/emailTemplates/accountBlocked.js";
import { accountUnblockedTemplate } from "../utils/emailTemplates/accountUnblocked.js";

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
    return res.status(200).json(new ApiResponse(200,responseData,"All users fetched successfully"))
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
    await sendEmail({
        to: user.email,
        subject: "Account Blocked",
        html:accountBlockedTemplate(req.body.reason)
    })
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

    await sendEmail({
        to: user.email,
        subject: "Account Unblocked",
        html: accountUnblockedTemplate(),
    })
    return res.status(200).json(new ApiResponse(200,{},"User unblocked successfully"))
})