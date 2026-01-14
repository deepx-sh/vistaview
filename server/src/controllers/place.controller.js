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

    return res.status(201).json(new ApiResponse(201,place,"Place submitted for approval"))
})