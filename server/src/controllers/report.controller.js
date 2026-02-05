import { Report } from "../models/report.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReport = asyncHandler(async (req, res) => {
    const { targetType, targetId, reason, message } = req.body;

    // prevent duplicate report by same user on same target

    const existing = await Report.findOne({
        reporter: req.user._id,
        targetType,
        targetId,
        status:"pending"
    })


    if (existing) {
        throw new ApiError(400,"You have already reported this")
    }

    await Report.create({
        reporter: req.user._id,
        targetType,
        targetId,
        reason,
        message
    })

    return res.status(201).json(new ApiResponse(201,{},"Report submitted successfully"))
})