import { Place } from "../models/place.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchPlaces = asyncHandler(async (req, res) => {
    const { q, category, city, minRating, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
    
    const query = { status: "approved" };

    // Text search
    if (q) {
        query.$text = { $search: q }; //Search words not exact value
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
        query.averageRating = { $gte: Number(minRating) };
    }

    if (minPrice || maxPrice) {
        // query["pricing.min"] = {};
        if (minPrice) {
            // query["pricing.min"].$gte = Number(minPrice);
            query["pricing.min"] ={...query["pricing.min"],$gte:Number(minPrice)}
            
        }
        if (maxPrice) {
            // query["pricing.min"].$lte = Number(maxPrice);
            query["pricing.max"] ={...query["pricing.max"],$lte:Number(maxPrice)}
        }
    }
    
    let sortOptions = {};

    if (q && !sortBy) {
        sortOptions = { score: { $meta: "textScore" } };
    } else if (sortBy) {
        const field = sortBy === "rating" ? "averageRating" : sortBy === "price" ? "pricing.min" : sortBy;
        sortOptions[field] = sortOrder === "asc" ? 1 : -1;
    } else {
        sortOptions={isFeatured:-1,createdAt:-1}
    }
    // const places = await Place.find(query, {
    //     score: q ? { $meta: "textScore" } : undefined //textScore is how well does this document match the search words and meta give special metadata not normal fields like it will give relevance score for the document so we can sort by best matches and its calculate for every query time and score not stored in db
    // }).sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    //     .skip((Number(page) - 1) * Number(limit))
    //     .limit(Number(limit)); //if searching text is present then sort by best match first if not then sort by newest place
    
    let dbQuery = Place.find(query);

    if (q) {
        dbQuery = dbQuery
            .select({ score: { $meta: "textScore" } })
            // .sort({score:{$meta:"textScore"}})
    }
    // else {
    //     dbQuery=dbQuery.sort({isFeatured:-1,createdAt:-1})
    // }

    const places = await dbQuery
        .sort(sortOptions)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
    
    const total = await Place.countDocuments(dbQuery);
    const pages = Math.ceil(total / limit);

    const responseData = {
        page,
        count: places.length,
        places,
        pages,
        total
    }

    return res.status(200).json(new ApiResponse(200,responseData,"Places fetched successfully"))
});