import Place from '../models/place.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';


// Create Place (OWNER)

export const createPlace = asyncHandler(async (req, res) => {
    const place = await Place.create({
        ...req.body,
        owner: req.user._id,
        status:"pending"
    })

    if (!place) {
        throw new ApiError(400,"Failed to create place")
    }
    return res.status(201).json(new ApiResponse(201,place,"Place submitted for approval"))
});


// Get All Approved Places (PUBLIC)

export const getPlaces = asyncHandler(async (req, res) => {
    const { category, location, page = 1, limit = 10 } = req.query;

    const query = { status: "approved" };

    if (category) {
        query.category = category;
    }

    if (location) {
        query["location.city"] = location;
    }

    const places = await Place.find(query).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).sort({ isFeatured: -1, createdAt: -1 });
    const total = await Place.countDocuments(query);

    return res.status(200).json(new ApiResponse(200, places, "Places fetched successfully"));
})