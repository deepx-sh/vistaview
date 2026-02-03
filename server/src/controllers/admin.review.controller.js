import { Review } from "../models/review.model.js";


import recalculatePlaceRating from './../utils/recalculatePlaceRating.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET FLAGGED REVIEWS

export const getFlaggedReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({
        spamScore: { $gte: 50 }
    }).populate("user", "name email").populate("place", "name");

    if (!reviews) {
        throw new ApiError(404,"No review found")
    }

    const responseData = {
        count:reviews.length,
        reviews
    }

    return res.status(200).json(new ApiResponse(200,responseData,"Flagged reviews fetched successfully"))
});


// GET ALL REVIEWS

export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
    const reviews = await Review.find().populate("user", "name email").populate("place", "name").sort({ createdAt: -1 })

    if (!reviews) {
        throw new ApiError(404,"No review found")
    }

    const responseData = {
        count:reviews.length,
        reviews
    }

    return res.status(200).json(new ApiResponse(200,responseData,"All reviews fetched successfully"))
});


// SOFT DELETE REVIEW

export const adminDeleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review || review.isDeleted) {
        throw new ApiError(404,"Review not found or already review deleted")
    }

    review.isDeleted = true;
    await review.save();

    await recalculatePlaceRating(review.place);

    return res.status(200).json(new ApiResponse(200,{},"Review soft deleted by admin"))
});


// Restore Review

export const restoreReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review || !review.isDeleted) {
        throw new ApiError(404,"Review not found or already review deleted")
    }

    review.isDeleted = false;
    await review.save();

    await recalculatePlaceRating(review.place);

    return res.status(200).json(new ApiResponse(200,{},"Review restored by admin"))
});


// HARD DELETE REVIEW

export const hardDeleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!reviews) {
        throw new ApiError(404,"No review found")
    }

    await review.deleteOne();

    await recalculatePlaceRating(review.place);

    return res.status(200).json(new ApiResponse(200,{},"Review permanently deleted"))
})