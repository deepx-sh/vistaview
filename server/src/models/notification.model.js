import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    title: {
        type: String,
        required: true,
        maxlength:100
    },
    message: {
        type: String,
        required: true,
        maxlength:500
    },
    isRead: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);