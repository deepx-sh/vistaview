import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'


export const getPendingOwners = asyncHandler(async (req, res) => {
    
    const owners = await User.find({
            "ownerProfile.status":"pending"
    }).select('name email ownerProfile')  
    
    if (!owners) {
        throw new ApiError(404, "No pending owners found");
    }
    return res.status(200).json(new ApiResponse(200,owners,"Pending owners retrieved successfully"))
})