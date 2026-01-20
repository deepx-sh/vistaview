import { Place } from "../models/place.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchPlaces = asyncHandler(async (req, res) => {
    const { q, category, city, minRating, minPrice, maxPrice, page, limit } = req.query;
    
    const query = { status: "approved" };

    // Text search
    if (q) {
        query.$text={$search:q} //Search words not exact value
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // City filter
    if (city) {
        query["location.city"] = city;
    }

    if (minRating) {
        query.averageRating={$gte:Number(minRating)}
    }

    if (minPrice || maxPrice) {
        query["pricing.min"] = {};
        if (minPrice) {
            query["pricing.min"].$gte = Number(minPrice);
        }
        if (maxPrice) {
            query["pricing.min"].$lte=Number(maxPrice)
        }
    }

    const places = await Place.find(query, {
        score: q ? { $meta: "textScore" } : undefined //textScore is how well does this document match the search words and meta give special metadata not normal fields like it will give relevance score for the document so we can sort by best matches and its calculate for every query time and score not stored in db
    }).sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)); //if searching text is present then sort by best match first if not then sort by newest place
    
    const responseData = {
        page,
        count: places.length,
        places
    }

    return res.status(200).json(new ApiResponse(200,responseData,"Places fetched successfully"))
});