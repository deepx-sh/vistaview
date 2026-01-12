import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        throw new ApiError(401, "Not authenticated");
    }

    let decodedInfo;
    try {
        decodedInfo = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401,"Invalid or expired access token")
    }

    const user = await User.findById(decodedInfo.id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    if (user.isBlocked) {
        throw new ApiError(403,"User account is blocked")
    }

    req.user = user;
    next();
})