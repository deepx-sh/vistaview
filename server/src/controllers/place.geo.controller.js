import { Place } from "../models/place.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const nearbyPlaces = asyncHandler(async (req, res) => {
    const { lat, lng, distance } = req.query;
    
    // This will use MongoDB's geospatial query to find approved places within the specified distance
    const places = await Place.find({
        status: "approved",
        location: {
            $near: { //near operator find documents from nearest to farthest given point i added 2dsphere index on location field in place model because without index it won't work
                $geometry: {
                    type: "Point",
                    coordinates: [Number(lng), Number(lat)]
                },
                $maxDistance:Number(distance)*1000 //Convert km to meters
            }
        }
    })

    if (!places || places.length === 0) {
        throw new ApiError(404,"No nearby places found")
    }
    const responseData = {
        count: places.length,
        places
    }

    return res.status(200).json(new ApiResponse(200,responseData,"Nearby places fetched successfully"))
})