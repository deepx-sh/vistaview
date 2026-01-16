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

    if (!places) {
        throw new ApiError(404,"No places found")
    }
    const total = await Place.countDocuments(query);

    return res.status(200).json(new ApiResponse(200, places, "Places fetched successfully"));
});

// Get Place by ID(PUBLIC)

export const getPlaceById = asyncHandler(async (req, res) => {
    const place = await Place.findOne({
        _id: req.params.id,
        status: "approved"
    }).populate("owner", "name");

    if (!place) {
        throw new ApiError(404, "Place not found");
    }

    place.views += 1;
    await place.save();

    return res.status(200).json(new ApiResponse(200, place, "Place fetched successfully"));
});

// Update Place (OWNER)

export const updatePlace = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);

    if (!place) {
        throw new ApiError(404, "Place not found");
    }

    if (place.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403,"You are not authorized to update this place")
    }

    Object.assign(place, req.body);
    place.status = "pending"; //Re-approval required after update
    await place.save();

    return res.status(200).json(new ApiResponse(200, place, "Place updated and sent for re-approval"));
});

// Delete Place (OWNER

export const deletePlace = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);

     if (!place) {
        throw new ApiError(404, "Place not found");
    }

    if (place.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403,"You are not authorized to update this place")
    }

    await place.deleteOne();

    return res.status(200).json(new ApiResponse(200,{},"Place deleted successfully"))
});
