import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetType: {
        type: String,
        enum: ["place", "review"],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reason: {
        type: String,
        enum:["spam","fake","offensive","misleading","copyright","other"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved","rejected"],
        default: "pending"
    },
    message: {
        type: String,
        maxlength:300
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviewedAt: {
        type:Date
    },
    adminNote: {
        type: String,
        maxlength:300
    }
}, { timestamps: true });

export const Report=mongoose.model("Report",reportSchema)