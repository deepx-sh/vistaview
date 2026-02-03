import { Report } from './../models/report.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getPendingReports = asyncHandler(async (req, res) => {
    const reports = await Report.find({ status: "pending" }).populate("reporter", "name email").sort({ createdAt: -1 });

    if (!reports) {
        throw new ApiError(404,"No pending reports found")
    }

    const responseData = {
        count: reports.length,
        reports
    }

    return res.status(200).json(new ApiResponse(200,responseData,"All pending reports fetched successfully"))
});


export const getAllReports = asyncHandler(async (req, res) => {
    const reports = await Report.find().populate("reporter", "name email").sort({ createdAt: -1 });

     if (!reports) {
        throw new ApiError(404,"No reports found")
    }

    const responseData = {
        count: reports.length,
        reports
    }

    return res.status(200).json(new ApiResponse(200,responseData,"All  reports fetched successfully"))
});


export const resolveReport = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);

    if (!report || report.status !== "pending") {
        throw new ApiError(404,"No report found or report already resolved")
    }

    report.status = "resolved";
    report.reviewedBy = req.user._id;
    report.reviewedAt= new Date();
    report.adminNote= req.body.adminNote;
        
    await report.save();

    return res.status(200).json(new ApiResponse(200,{},"Report resolved"))
});


export const rejectReport = asyncHandler(async (req, res) => {
   const report = await Report.findById(req.params.id);

    if (!report || report.status !== "pending") {
        throw new ApiError(404,"No report found or report already rejected")
    }

    report.status = "rejected";
    report.reviewedBy = req.user._id;
    report.reviewedAt= new Date();
    report.adminNote= req.body.adminNote;
        
    await report.save();

    return res.status(200).json(new ApiResponse(200,{},"Report rejected"))
})