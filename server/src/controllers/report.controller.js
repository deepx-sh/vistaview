import { Report } from "../models/report.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createReport = asyncHandler(async (req, res) => {
    const { targetType, targetId, reason, message } = req.body;

    // prevent duplicate report by same user on same target

    const existing = await Report.findOne({
        reporter: req.user_id,
        targetType,
        targetId,
        status:"pending"
    })


    if (existing) {
        throw new ApiError(400,"You have already reported this")
    }

    await Report.create({
        reporter: req.user_id,
        targetType,
        targetId,
        reason,
        message
    })

    return res.status(201).json(new ApiResponse(201,{},"Report submitted successfully"))
})