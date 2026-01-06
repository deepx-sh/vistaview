import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const ownerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    documents: [{
        type: String,
        validate: {
            validator: validator.isURL,
            message: "Documents must be a valid URL"
        }
    }],
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    verificationAt: {
        type: Date
    }
}, { timestamps: true });

export const Owner = mongoose.model("Owner", ownerSchema);