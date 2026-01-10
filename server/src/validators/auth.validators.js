import Joi from 'joi';

const emailRegex =/^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,32}$/;

export const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name cannot exceed 50 characters",
            "any.required":"Name is required"
        }),
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .pattern(emailRegex)
        .required()
        .messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
            "string.pattern.base": "Enter a valid email address",
            "any.required":"Email is required"
        }),
    
    password: Joi.string()
        .pattern(passwordRegex)
        .min(8)
        .required()
        .messages({
            "string.pattern.base": "Password requires at least one digit, one lowercase letter, one uppercase letter, one special character, and a length between 8 and 32 characters.",
            "any.required":"Password is required"
        })
    
});


export const verifyEmailOTPSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .pattern(emailRegex)
        .required()
        .messages({
            "string.empty": "Email cannot be empty",
            "string.pattern.base": "Please enter a valid email address",
            "any.required":"Email is required"
        }),
    
    otp: Joi.string()
        .trim()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            "string.empty": "OTP cannot be empty",
            "string.length": "OTP must be exactly 6 digits",
            "string.pattern.base": "OTP must contain only numbers",
            "any.required":"OTP is required"
        })
});

export const loginSchema = Joi.object({
    email:Joi.string()
        .trim()
        .lowercase()
        .pattern(emailRegex)
        .required()
        .messages({
            "string.empty": "Email cannot be empty",
            "string.pattern.base": "Please enter a valid email address",
            "any.required":"Email is required"
        }),
    
    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password cannot be empty",
            "any.required":"Password is required"
        })
});

export const resendVerifyOTPSchema = Joi.object({
     email:Joi.string()
        .trim()
        .lowercase()
        .pattern(emailRegex)
        .required()
        .messages({
            "string.empty": "Email cannot be empty",
            "string.pattern.base": "Please enter a valid email address",
            "any.required":"Email is required"
        }),
});

export const sendPasswordResetOTPSchema = Joi.object({
    email:Joi.string()
        .trim()
        .lowercase()
        .pattern(emailRegex)
        .required()
        .messages({
            "string.empty": "Email cannot be empty",
            "string.pattern.base": "Please enter a valid email address",
            "any.required":"Email is required"
        }),
});

export const verifyPasswordResetOTPSchema = Joi.object({
    email:Joi.string()
        .trim()
        .lowercase()
        .pattern(emailRegex)
        .required()
        .messages({
            "string.empty": "Email cannot be empty",
            "string.pattern.base": "Please enter a valid email address",
            "any.required":"Email is required"
        }),
     otp: Joi.string()
        .trim()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            "string.empty": "OTP cannot be empty",
            "string.length": "OTP must be exactly 6 digits",
            "string.pattern.base": "OTP must contain only numbers",
            "any.required":"OTP is required"
        })
});

export const resetPasswordSchema = Joi.object({
    resetToken: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Reset token cannot be empty",
            "any.required":"Reset token is required"
        }),
    
    newPassword: Joi.string()
        .pattern(passwordRegex)
        .required()
        .min(8)
        .messages({
            "string.empty": "New password cannot be empty",
            "string.min": "New password must be at least 8 characters",
            "string.pattern.base": "Password requires at least one digit, one lowercase letter, one uppercase letter, one special character, and a length between 8 and 32 characters.",
            "any.required":"New password is required"
        }),
    
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.only": "Password do not match",
            "any.required":"Please confirm your password"
        })
})