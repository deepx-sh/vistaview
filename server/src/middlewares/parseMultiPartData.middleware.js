import { asyncHandler } from "../utils/asyncHandler.js";

export const parseMultiPartData = asyncHandler(async (req, res, next) => {
    if (typeof req.body.location === "string") {
        req.body.location=JSON.parse(req.body.location)
    }

    if (typeof req.body?.pricing === "string") {
        req.body.pricing=JSON.parse(req.body.pricing)
    }

    if (typeof req.body?.timings === "string") {
        req.body.timings=JSON.parse(req.body.timings)
    }
    next();
})