import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    type: {
        type: String,
        enum:["review","reply","admin"],
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength:500
    },
    link: {
        type:String
    },
    isRead: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);