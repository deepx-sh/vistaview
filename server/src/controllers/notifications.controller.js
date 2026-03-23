import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
    
    const unreadCount = await Notification.countDocuments({
        user: req.user._id,
        isRead:false
    })

    return res.status(200).json(new ApiResponse(200,{notifications,unreadCount},"Notification fetched successfully"))
});


export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user:req.user._id
    })

    if (!notification) {
        throw new ApiError(404,"Notification not found")
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json(new ApiResponse(200,{},"Notification marked as read"))
});

export const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        {$set:{isRead:true}}
    )

    return res.status(200).json(new ApiResponse(200,{},"All notifications marks as read"))
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user:req.user._id
    })

    if (!notification) {
        throw new ApiError(404,"Notification not found")
    }

    return res.status(200).json(new ApiResponse(200,{},"Notification deleted"))
});

export const clearAllNotification = asyncHandler(async (req, res) => {
    await Notification.deleteMany({ user: req.user._id });

    return res.status(200).json(new ApiResponse(200,{},"All notifications cleared"))
})