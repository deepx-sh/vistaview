import express from 'express';

import { register, verifyEmailOTP, login, resendVerifyOTP, sendPasswordResetOTP, verifyPasswordResetOTP, resetPassword, refreshToken, logout, getMe } from '../controllers/auth.controller.js';

import validate from '../middlewares/validate.middleware.js';

import { registerSchema, verifyEmailOTPSchema, loginSchema, sendPasswordResetOTPSchema, verifyPasswordResetOTPSchema, resetPasswordSchema, resendVerifyOTPSchema } from '../validators/auth.validators.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import { otpLimiter,loginLimiter,passwordResetLimiter } from '../config/rateLimiter.js';
const router = express.Router();

router.post("/register",otpLimiter, validate(registerSchema), register);

router.post("/verify-email",otpLimiter, validate(verifyEmailOTPSchema), verifyEmailOTP);
router.post("/resend-verify-otp",otpLimiter, validate(resendVerifyOTPSchema), resendVerifyOTP);
router.post("/login",loginLimiter, validate(loginSchema), login);

router.post("/logout", authMiddleware, logout);
router.post("/forgot-password",passwordResetLimiter, validate(sendPasswordResetOTPSchema), sendPasswordResetOTP);

router.post("/verify-reset-otp",otpLimiter, validate(verifyPasswordResetOTPSchema), verifyPasswordResetOTP);
router.post("/reset-password",otpLimiter, validate(resetPasswordSchema), resetPassword);

router.get("/me",authMiddleware,getMe)
router.post("/refresh-token", refreshToken);


export default router;