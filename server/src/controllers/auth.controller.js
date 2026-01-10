import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { generateOTP } from '../utils/generateOTP.js';
import getToken from '../utils/getToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendOTP } from '../utils/sendOTP.js';
import { getCookieOptions } from '../utils/getCookieOptions.js';

// Register

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        throw new ApiError(409, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp =  generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10); 
    const user=await User.create({
        name,
        email,
        password: hashedPassword,
        emailVerificationCode: hashedOTP,
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


// Verify Email OTP

export const verifyEmailOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (user.isEmailVerified) {
        throw new ApiError(400,"Email is already verified")
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
        throw new ApiError(400,"No OTP found. Please request a new one")
    }

    if (Date.now() > user.emailVerificationExpires) {
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save()

        throw new ApiError(400,"OTP has expired. Please request a new one")
    }

    const isOTPValid = await bcrypt.compare(otp, user.emailVerificationCode);

    if (!isOTPValid) {
        throw new ApiError(400, "Invalid OTP");
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    const { accessToken, refreshToken } = await getToken(user);

    const responseData = {
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role:user.role
    }

    return res.status(200).cookie("accessToken",accessToken,getCookieOptions(15*60*1000)).cookie("refreshToken",refreshToken,getCookieOptions(7*24*60*60*1000)).json(new ApiResponse(200,responseData,"Email verified successfully. You are now logged in"))
});


export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400,"Invalid email or password")
    }

    if (!user.isEmailVerified) {
        throw new ApiError(403,"Email is not verified")
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new ApiError(401,"Invalid email or password")
    }

    const { accessToken, refreshToken } = await getToken(user);

    const responseData = {
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role:user.role
    }

    return res.status(200).cookie("accessToken",accessToken,getCookieOptions(15*60*1000)).cookie("refreshToken",refreshToken,getCookieOptions(7*24*60*60*1000)).json(new ApiResponse(200,responseData,"Login successful"))
});

export const logout = asyncHandler(async (req, res) => {
    if (req.user) {
        req.user.refreshToken = undefined;
        await user.save();
    }

    return res.status(200).clearCookie("accessToken",getCookieOptions(0)).clearCookie("refreshToken",getCookieOptions(0)).json(new ApiResponse(200,{},"Logged out successfully"))
});

export const resendVerifyOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404,"No account found with this email")
    }

    if (user.isEmailVerified) {
        throw new ApiError(400,"This email is already verified")
    }

    const otp =  generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10); 

    user.emailVerificationCode = hashedOTP;
    user.emailVerificationExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(user, "verify", otp);

    return res.status(200).json(new ApiResponse(200,{email},"New verification code sent to your email. Please check your inbox"))
});

export const sendPasswordResetOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).json(new ApiResponse(200,{},"If this email is registered, a password reset code has been sent"))
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400,"Please verify your email before resetting password")
    }

     const otp =  generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10); 

    user.resetPasswordCode = hashedOTP;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendOTP(user, "resetPassword", otp)
    
    return res.status(200).json(new ApiResponse(200,{},"Password reset code sent to your email. Please check your inbox"))
});

export const verifyPasswordResetOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (!user.resetPasswordCode || !user.resetPasswordExpires) {
        throw new ApiError(400,"No Reset OTP found. Please request a new one")
    }

    if (Date.now() > user.resetPasswordExpires) {
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;

        await user.save()
        throw new ApiError(400,"Reset OTP expired. Please request a new one")
    }

    const resetOTPisMatch = await bcrypt.compare(otp, user.resetPasswordCode)
    
    if (!resetOTPisMatch) {
        throw new ApiError(400,"Invalid Reset OTP")
    }

    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const resetToken = jwt.sign({
        _id: user._id,
        email: user.email,
        purpose:"resetPassword"
    }, process.env.JWT_RESET_PASSWORD_SECRET, { expiresIn: process.env.JWT_RESET_PASSWORD_SECRET_EXPIRE });
    
    return res.status(200).json(new ApiResponse(200,{resetToken},"OTP verified successfully. You can now reset your password"))
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        throw new ApiError(400,"Password do not match")
    }
    let decodedInfo;

    try {
        decodedInfo=await jwt.verify(resetToken,process.env.JWT_RESET_PASSWORD_SECRET)
    } catch (error) {
        throw new ApiError(400,"Invalid or expired reset token")
    }
    
    const user = await User.findById(decodedInfo._id);

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (decodedInfo.email !== user.email) {
        throw new ApiError(400,"Invalid reset token")
    }
    if (decodedInfo.purpose !== "resetPassword") {
        throw new ApiError(400,"Invalid reset token purpose")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.refreshToken = undefined;
    await user.save();

    return res.status(200).json(new ApiResponse(200,{},"Password reset successfully. You can now log in with your new password"))
})