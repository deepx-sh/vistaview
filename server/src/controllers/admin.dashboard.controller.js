import { User } from "../models/user.model.js";
import { Place } from "../models/place.model.js";
import { Review } from "../models/review.model.js";
import { Report } from "../models/report.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
    
    // User
    const totalUsers = await User.countDocuments();
    const totalOwners = await User.countDocuments({ role: "owner" });
    const verifiedOwners = await User.countDocuments({
        role: "owner",
        "ownerProfile.status":"approved"
    })

    const blockedUsers = await User.countDocuments({ isBlocked: true });


    // Places
    const totalPlaces = await Place.countDocuments();
    const approvedPlaces = await Place.countDocuments({ status: "approved" });
    const pendingPlaces=await Place.countDocuments({status:"pending"})

    // Review
    const totalReviews = await Review.countDocuments({ isDeleted: false });
    const flaggedReviews = await Review.countDocuments({
        spamScore: { $gte: 50 }
    })


    // Reports
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" })
    

    const responseData = {
        users: {
            totalUsers,
            totalOwners,
            verifiedOwners,
            blockedUsers
        },

        places: {
            totalPlaces,
            approvedPlaces,
            pendingPlaces
        },

        reviews: {
            totalReviews,
            flaggedReviews
        },

        reports: {
            totalReports,
            pendingReports
        }
    }


    return res.status(200).json(new ApiResponse(200,responseData,"Admin dashboard details fetched successfully"))
})