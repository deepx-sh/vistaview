import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    images: [{
        url: {
            type: String,
            validate: [validator.isURL, "Invalid image URL"]
        },
        publicId: String
    }],
    helpfulVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    ownerReply: {
        text: {
            type: String,
            trim:true,
            maxlength: 1000
        },
        repliedAt: Date
    },
    spamScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

reviewSchema.index({ user: 1, place: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
