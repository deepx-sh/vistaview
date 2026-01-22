import { Place } from '../models/place.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import deleteImageFromCloudinary from '../utils/deleteImageFromCloudinary.js';


// Create Place (OWNER)

export const createPlace = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400,"At least one place image is required")
    }
    const images = req.files.map(file => ({
        url: file.path,
        publicId:file.filename
    }))
    const place = await Place.create({
        ...req.body,
        images,
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

    const { deletedImages = [] } = req.body;
     if (place.images.length- deletedImages.length +(req.files ? req.files.length :0)===0) {
        throw new ApiError(400,"At least one place image is required")
    }
    if (deletedImages.length > 0) {
        // Delete images from cloudinary
        for (const publicId of deletedImages) {
            await deleteImageFromCloudinary(publicId)
        }
    }

    // Remove deleted images from DB
    place.images = place.images.filter(img => !deletedImages.includes(img.publicId));

   

    if (place.images.length + (req.files ? req.files.length : 0) > 5) {
        throw new ApiError(400,"A maximum of 5 images are allowed per place")
    }
    // Add new images

    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            url: file.path,
            publicId:file.filename
        }))
        place.images.push(...newImages)
    }
    Object.assign(place, req.body);
    place.status = "pending"; //Re-approval required after update
    await place.save();

    return res.status(200).json(new ApiResponse(200, place, "Place updated and sent for re-approval"));
});

// Delete Place (OWNER)

export const deletePlace = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);

     if (!place) {
        throw new ApiError(404, "Place not found");
    }

    if (place.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403,"You are not authorized to update this place")
    }

    // Delete images from cloudinary
    for (const img of place.images) {
        await deleteImageFromCloudinary(img.publicId);
    }
    await place.deleteOne();

    return res.status(200).json(new ApiResponse(200,{},"Place deleted successfully"))
});


// Admin APPROVE/REJECT 
export const approvePlace = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);

     if (!place) {
        throw new ApiError(404, "Place not found");
    }

    place.status = req.body.status; //Approve or Rejected
    await place.save();

    return res.status(200).json(new ApiResponse(200,place,`Place ${place.status} successfully`))
})