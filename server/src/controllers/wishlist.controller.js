import { User } from "../models/user.model.js";
import { Place } from "../models/place.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ADD TO WISHLIST

export const addToWishlist = asyncHandler(async (req, res) => {
    const { placeId } = req.params;

    const place = await Place.findById(placeId);

    if (!place || place.status !== "approved") {
        throw new ApiError(404,"No place found or place not approved yet")
    }

    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(placeId)) {
        throw new ApiError(400,"Already in wishlist")
    }

    user.wishlist.push(placeId);

    await user.save();

    return res.status(200).json(new ApiResponse(200,{},'Added to wishlist'))
});


// REMOVE FROM WISHLIST

export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { placeId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
        id => id.toString() !== placeId
    );

    await user.save();

    return res.status(200).json(new ApiResponse(200,{},"Removed from wishlist"))
});


// GET WISHLIST

export const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist")

    const responseData = {
        count: user.wishlist.length,
        wishlist:user.wishlist
    }
    return res.status(200).json(new ApiResponse(200,responseData,"Wishlist fetched successfully"))
})