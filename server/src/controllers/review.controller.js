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

    if (req.files && req.files.length > 5) {
        throw new ApiError(400, "A maximum of 5 images are allowed per review");
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
    
})