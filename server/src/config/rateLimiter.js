import { rateLimit } from 'express-rate-limit';

const tooManyMsg = (action, waitMinutes) => ({
    success: false,
    message:`Too many ${action} attempts. Please try again after ${waitMinutes} minute${waitMinutes!==1 ? "s":""}`
});


export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooManyMsg("OTP", 15),
    skipSuccessfulRequests:false,
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooManyMsg("login", 15),
    skipSuccessfulRequests:true
});

export const passwordResetLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooManyMsg("password reset", 30),
});


export const reportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooManyMsg("report submission", 60),
})


export const generalLimiter = rateLimit({
    windowMs:10*60*1000,
    max: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooManyMsg("API", 10),
    skip: (req) => {
        return req.user?.role==="admin"
    }
})