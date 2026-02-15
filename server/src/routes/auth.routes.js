import express from 'express';

import { register, verifyEmailOTP, login, resendVerifyOTP, sendPasswordResetOTP, verifyPasswordResetOTP, resetPassword, refreshToken, logout, getMe } from '../controllers/auth.controller.js';

import validate from '../middlewares/validate.middleware.js';

import { registerSchema, verifyEmailOTPSchema, loginSchema, sendPasswordResetOTPSchema, verifyPasswordResetOTPSchema, resetPasswordSchema, resendVerifyOTPSchema } from '../validators/auth.validators.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/verify-email", validate(verifyEmailOTPSchema), verifyEmailOTP);
router.post("/resend-verify-otp", validate(resendVerifyOTPSchema), resendVerifyOTP);
router.post("/login", validate(loginSchema), login);

router.post("/logout", authMiddleware, logout);
router.post("/forgot-password", validate(sendPasswordResetOTPSchema), sendPasswordResetOTP);

router.post("/verify-reset-otp", validate(verifyPasswordResetOTPSchema), verifyPasswordResetOTP);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.get("/me",authMiddleware,getMe)
router.post("/refresh-token", refreshToken);


export default router;