import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateOTP } from '../utils/generateOTP.js';
import getToken from '../utils/getToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendOTP } from '../utils/sendOTP.js';

// Register

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        throw new ApiError(409, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user=await User.create({
        name,
        email,
        password: hashedPassword,
        emailVerificationCode: otp,
        emailVerificationExpires: Date.now() + 5 * 60 * 1000
    })

    const createdUser = await User.findById(user._id);
    
    if (!createdUser) {
        throw new ApiError(500,"User registration failed")
    }

    await sendOTP(createdUser, "verify", otp);

    const responseData = {
        name: createdUser.name,
        email: createdUser.email,
        isEmailVerified:createdUser.isEmailVerified
    }
    return res.status(201).json(new ApiResponse(201,responseData,"User registered successfully. Verification OTP sent to your email"))
})
