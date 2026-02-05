import sendEmail from "../config/mailer.js";
import { Place } from "../models/place.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { placeApprovedTemplate } from "../utils/emailTemplates/placeApproved.js";
import { placeRejectedTemplate } from "../utils/emailTemplates/placeRejected.js";

// GET PENDING PLACES
export const getPendingPlaces = asyncHandler(async (req, res) => {
    const places = await Place.find({ status: "pending" }).populate("owner", "name email");

    const responseData = {
        count: places.length,
        places
    }

    return res.status(200).json(new ApiResponse(200,responseData,"Pending places fetched successfully"))
});

// APPROVE PLACE
export const approvePlace = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id).populate("owner","email");

    if (!place) {
        throw new ApiError(404,"Place not found")
    }

    place.status = "approved";
    place.rejectionReason = undefined;


    await place.save();
    await sendEmail({
        to: place.owner.email,
        subject: "Place Approved",
        html:placeApprovedTemplate(place.name)
    })
    return res.status(200).json(new ApiResponse(200,{},"Place approved"))
});


// REJECT PLACE
export const rejectPlace = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id).populate("owner","email");

    if (!place) {
        throw new ApiError(404,"No place found")
    }

    place.status = "rejected";
    place.rejectionReason = req.body.reason;
    place.isFeatured = false;

    await place.save();

    await sendEmail({
        to: place.owner.email,
        subject: "Place Rejected",
        html:placeRejectedTemplate(place.name,req.body.reason)
    })
    return res.status(200).json(new ApiResponse(200, {}, "Place rejected"));
});


// FEATURE / UN-FEATURE PLACE

export const toggleFeaturePlace = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);

    if (!place || place.status !== "approved") {
        throw new ApiError(400,"Only approved places can be featured")
    }

    place.isFeatured = req.body.isFeatured;
    await place.save();

    return res.status(200).json(new ApiResponse(200,{},`Place ${req.body.isFeatured? 'featured' : 'un-featured'} successfully`))
});


// GET ALL PLACES FOR ADMIN

export const getAllPlacesAdmin = asyncHandler(async (req, res) => {
    const places = await Place.find().populate("owner", "name email").sort({ createdAt: -1 });

    if (!places) {
        throw new ApiError(404, "No places found");
    }

    const responseData = {
        count: places.length,
        places
    }

    return res.status(200).json(new ApiResponse(200,responseData,"All places fetched successfully"))
})