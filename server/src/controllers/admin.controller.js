import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import sendEmail from '../config/mailer.js';
import { ownerApprovedTemplate } from '../utils/emailTemplates/ownerApproved.js';
import { ownerRejectedTemplate } from '../utils/emailTemplates/ownerRejected.js';


export const getPendingOwners = asyncHandler(async (req, res) => {
    
    const owners = await User.find({
            "ownerProfile.status":"pending"
    }).select('name email ownerProfile')  
    
    if (!owners) {
        throw new ApiError(404, "No pending owners found");
    }
    return res.status(200).json(new ApiResponse(200,owners,"Pending owners retrieved successfully"))
});


export const reviewOwner = asyncHandler(async (req, res) => {
    const { status, rejectedReason } = req.body;

    const user = await User.findById(req.params.userId);

    if (!user || !user.ownerProfile?.status !== "pending") {
        throw new ApiError(404, "Owner not in pending status");
    }

    if (status === "approved") {
        user.ownerProfile.status = "approved";
        user.ownerProfile.approvedAt = new Date();
        user.role="owner"
    }

    if (status === "rejected") {
        if (!rejectedReason) {
            throw new ApiError(400,"Rejected reason is required")
        } else {
            user.ownerProfile.status = "rejected";
            user.ownerProfile.rejectedReason = rejectedReason;
        }
    }

    await user.save();

    if (status === "approved") {
        await sendEmail({
            to: user.email,
            subject: "Owner Verification Approved",
            html: ownerApprovedTemplate(user.name),
        })
    }

    if (status === "rejected") {
        await sendEmail({
            to: user.name,
            subject: "Owner Verification Rejected",
            html:ownerRejectedTemplate(user.name,rejectedReason)
        })
    }
    return res.status(200).json(new ApiResponse(200,{},`Owner request ${status}`))
})