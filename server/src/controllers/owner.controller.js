import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from "../utils/asyncHandler.js"

export const applyForOwner = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.ownerProfile?.status === "pending") {
        throw new ApiError(400,"Verification already pending")
    }

    if (user.ownerProfile?.status === "approved") {
        throw new ApiError(400,"Already a verified owner")
    }

    if (!req.files || req.files?.length === 0) {
        throw new ApiError(400,"At lease one document is required for owner verification")
    }
    if (req.files?.length > 3) {
        throw new ApiError(400,"Maximum 3 documents are allowed")
    }

    const documents = req.files?.map(file => ({
        url: file.path,
        publicId:file.filename
    })) || []

    user.ownerProfile = {
        businessName: req.body.businessName,
        businessAddress: req.body.businessAddress,
        contactNumber: req.body.contactNumber,
        documents,
        status: "pending",
        appliedAt:new Date()
    }

    await user.save();
    return res.status(201).json(new ApiResponse(200,{},"Owner verification request submitted"))
})