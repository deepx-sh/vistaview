import { Review } from "../models/review.model";
import { Place } from "../models/place.model.js";

import spamDetector from "../utils/spamDetector.js";
import cloudinary from "../config/cloudinary.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import recalculatePlaceRating from "../utils/recalculatePlaceRating.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// ADD REVIEW

export const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const placeId = req.params.placeId;

    // Check if user already reviewed this place or not

    const existing = await Review.findOne({
        user: req.user._id,
        place: placeId
    });

    if (existing) {
        throw new ApiError(400, "You already reviewed this place");
    }

    const spamScore = spamDetector(comment);

    if (req.files && req.files.length > 3) {
        throw new ApiError(400, "A maximum of 3 images are allowed per review");
    }

    const images = req.files?.map(file => ({
        url: file.path,
        publicId: file.filename
    })) || [];

    const review = await Review.create({
        user: req.user._id,
        place: placeId,
        rating,
        comment,
        images,
        spamScore
    })

    // Update place stats
   
    await recalculatePlaceRating(placeId);

    return res.status(201).json(new ApiResponse(201, review, "Review added successfully"));
    
});


// UPDATE REVIEW

export const updateReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review || review.isDeleted) {
        throw new ApiError(404,"Review not found")
    }

    // Check same user perform update
    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403,"You are not authorized to update this review")
    }

    // Update fields

    if (req.body.rating !== undefined) {
        review.rating = req.body.rating;
    }

    if (req.body.comment) {
        review.comment = req.body.comment;
        review.spamScore = spamDetector(req.body.comment);
    }

    const { deletedImages = [] } = req.body;
    if (deletedImages.length > 0) {
        // Delete images from cloudinary
        for (const publicId of deletedImages) {
            await cloudinary.uploader.destroy(publicId);
        }
    }

    // Remove deleted images from DB
    review.images = review.images.filter(img => !deletedImages.includes(img.publicId));

    if (review.images.length - deletedImages.length + (req.files ? req.files.length : 0) > 3) {
        throw new ApiError(400, "A maximum of 3 images are allowed per review");
    }

    // Add updated images
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));
        review.images.push(...newImages);
    }

    await review.save();

    // Recalculate place rating
    await recalculatePlaceRating(review.place);

    return res.status(200).json(new ApiResponse(200,review,"Review updated successfully"))
});

// DELETE REVIEW

export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review || review.isDeleted) {
        throw new ApiError(404,"Review not found")
    }

    // Check same user perform deletion
    if (review.user.toString() !== req.user._id.toSting()) {
        throw new ApiError(403,"You are not authorized to delete this review")
    }

    // Delete images from cloudinary
    for (const img of review.images) { 
        await cloudinary.uploader.destroy(img.publicId)
    }
    
    // Soft delete
    review.isDeleted = true;
    await review.save();

    await recalculatePlaceRating(review.place);

    return res.status(200).json(new ApiResponse(200,{},"Review deleted successfully"))
});

// LIKE REVIEW
export const likeReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
        throw new ApiError(404,"Review not found")
    }

    if (review.user.toString() === req.user._id.toString()) {
        throw new ApiError(400,"You cannot like your own review")
    }

    const index = review.helpfulVotes.indexOf(req.user._id);

    if (index === -1) {
        review.helpfulVotes.push(req.user._id);
    } else {
        review.helpfulVotes.splice(index, 1);
    }


    await review.save();
    const likes = review.helpfulVotes.length;

    return res.status(200).json(new ApiResponse(200,likes,"Review like updated"))
})