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
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);