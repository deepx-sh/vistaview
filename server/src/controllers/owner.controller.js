import cloudinary from '../config/cloudinary.js';
import sendEmail from '../config/mailer.js';
import { Place } from '../models/place.model.js';
import { Review } from '../models/review.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from "../utils/asyncHandler.js"
import createNotification from '../utils/createNotification.js';
import { ownerReplyTemplate } from '../utils/emailTemplates/ownerReply.js';

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
});

export const replyToReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { text } = req.body;

    const review = await Review.findById(reviewId).populate("user","email");

    if (!review || review.isDeleted) {
        throw new ApiError(404,"Review not found")
    }

    const place = await Place.findById(review.place);
    if (!place) {
        throw new ApiError(404,"Place not found")
    }

    // Ownership check
    if (place.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403,"Not authorized to reply to this review")
    }

    if (review.ownerReply?.text) {
        throw new ApiError(400,"Reply already exists for this review")
    }

    review.ownerReply = {
        text,
        repliedAt:new Date()
    }

    await review.save();

    // Notify user 
    await createNotification({
        user: review.user,
        type: "reply",
        message: `Owner replied to your review on ${place.name}`,
        link:`place/${place._id}`
    })

    await sendEmail({
        to: review.user.email,
        subject: "Owner Replied",
        html:ownerReplyTemplate(place.name,text)
    })
    const responseData = {
        reply:review.ownerReply
    }
    return res.status(200).json(new ApiResponse(200,responseData,"Reply added successfully"))
});


export const updateReply = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { text } = req.body;

    const review = await Review.findById(reviewId);

    if (!review || !review.ownerReply) {
        throw new ApiError(404,"Reply not found")
    }

    review.ownerReply.text = text
    review.ownerReply.repliedAt = new Date()
    
    await review.save();

    return res.status(200).json(new ApiResponse(200,{},"Reply updated successfully"))
});


export const deleteReply = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review || !review.ownerReply) {
        throw new ApiError(404,"Reply not found")
    }

    review.ownerReply = undefined;

    await review.save();

    return res.status(200).json(new ApiResponse(200,{},"Reply deleted successfully"))
})