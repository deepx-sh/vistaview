import { Place } from "../models/place.model";
import { Review } from "../models/review.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const getOwnerDashBoard = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const places = await Place.find({ owner: ownerId });

    if (!places) {
        throw new ApiError(404, "No places found");
    }

    const placeIds = places.map(p => p._id);

    // Total places
    const totalPlaces = placeIds.length;

    // Total views
    const totalViews = places.reduce((sum, p) => sum + p.views, 0);


    // Reviews for owner places
    const reviews = await Review.find({
        place: { $in: placeIds },
        isDeleted:false
    })

    if (!reviews) {
        throw new ApiError(404,"No reviews found")
    }

    const totalReviews = reviews.length;

    // Average rating for all places
    let avgRating = 0;
    if (totalReviews > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        avgRating=sum/totalReviews
    }

    // Per-place stats

    const placeStats = places.map(place => {
        const placeReviews = reviews.filter(
            r => r.place.toString() === place._id.toString()
        );

        return {
            place: place._id,
            name: place.name,
            status: place.status,
            views: place.views,
            totalReviews: placeReviews.length,
            averageRating:
                placeReviews.length >0 ? placeReviews.reduce((s,r)=>s+r.rating,0)/placeReviews.length:0
        }
    })

    const responseData = {
        owner: {
            isVerified:req.user.ownerProfile.status==="approved"
        },
        overview: {
            totalPlaces,
            totalReviews,
            totalViews,
            averageRating: avgRating
        },
        places:placeStats
    }

    return res.status(200).json(new ApiResponse(200,responseData,"Owner dashboard details fetched successfully"))
})