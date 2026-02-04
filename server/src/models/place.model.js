import mongoose, { mongo, Mongoose } from "mongoose";
import validator from "validator";

const placeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    name: {
        type: String,
        required: [true, "Place name is required"],
        trim: true,
        minlength: 3,
        maxlength: 100,
        text:true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: 20,
        maxlength: 2000,
        text:true
    },
    category: {
        type: String,
        enum: ["beach", "temple", "hill", "hotel", "heritage", "city", "nature"],
        required:true
    },
    images: [{
        url: {
            type: String,
            required: true,
            validate: [validator.isURL, "Invalid image URL"],
        },
        publicId:String
    }],
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default:"Point"
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: v => v.length === 2,
                message:"Coordinates must be [lng,lat]"
            }
        },
        address: {
            type: String,
            required:true
        },
        city: {
            type: String,
            required:true
        },
        state: {
            type: String,
            required:true
        }
    },
    pricing: {
        min: {
            type: Number,
            min:0
        },
        max: {
            type: Number,
            min:0
        }
    },

    timings: {
        open: {
            type:String
        },
        close: {
            type:String
        }
    },
    bestTimeToVisit: {
        type: String,
        maxlength:200
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default:"pending"
    },
    isFeatured: {
        type: Boolean,
        default:false
    },
    averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default:0
    },
    totalReviews: {
        type: Number,
        default: 0,
        min:0
    },
    views: {
        type: Number,
        default: 0,
        min:0
    }
}, { timestamps: true });

// Text search
// Without this mongodb can only match exact values will make searching slow and hard
// With this mongodb break words and searched in multiple field at once will make fast for this we use $text operator
placeSchema.index({
    name: "text",
    description: "text",
    "location.city": "text",
    "location.state": "text"
});

placeSchema.index({ location: "2dsphere" });

export const Place = mongoose.model("Place", placeSchema);