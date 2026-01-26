import mongoose, { Mongoose } from "mongoose";
import validator from "validator"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail,"Invalid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength:[8,"Password must be at least 8 characters"]
    },
    role: {
        type: String,
        enum: ["user", "owner", "admin"],
        default:"user"
    },
    avatar: {
        type: String,
        default: "https://images.unsplash.com/vector-1738312097380-45562da00459?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        validate: {
            validator: v => !v || validator.isURL(v),
            message:"Avatar must be a valid URL"
        }
    },
    avatarPublicId: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default:false
    },
    emailVerificationCode: {
        type: String,
        // minlength: 6,
        // maxlength:6
    },
    emailVerificationExpires: {
        type: Date
    },
    resetPasswordCode: {
        type: String,
        // minlength: 6,
        // maxlength:6,
    },
    resetPasswordExpires: {
        type:Date
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Place"
    }],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type:String
    },

    ownerProfile: {
        businessName: {
            type: String,
            trim: true,
            minlength: [3, "Business name must be at least 3 characters"],
            maxlength:[100,"Business name cannot exceed 100 characters"]
        },
        businessAddress: {
            type: String,
            trim: true,
            minlength: [10, "Business address must be at least 10 characters"],
            maxlength:[300,"Business address cannot exceed 300 characters"]
        },
        contactNumber: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^[0-9]{10}$/.test(v);
                },
                message:"Contact number must be a valid 10-digit number"
            }
        },

        documents: [
            {
                url: {
                    type: String,
                    required:true
                },
                publicId: {
                    type: String,
                    required:true
                }
            }
        ],

        status: {
            type: String,
            enum: {
                values: ["not_applied", "pending", "approved", "rejected"],
                message:"Invalid owner verification status"
            },
            default:"not_applied"
        },
        appliedAt: {
            type:Date
        },
        approvedAt: {
            type:Date
        },
        rejectedReason: {
            type: String,
            maxlength:[200,"Rejection reason cannot exceed 200 characters"]
        }
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);