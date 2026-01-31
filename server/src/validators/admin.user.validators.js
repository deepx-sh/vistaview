import Joi from 'joi';

export const blockUserSchema = Joi.object({
    reason: Joi.string().min(5).max(200).required().messages({
        'string.base': 'Rejection reason must be a string',
        'string.empty': 'Rejection reason cannot be empty',
        'string.min': 'Rejection reason must be at least 5 characters long',
        'string.max': 'Rejection reason cannot exceed 200 characters',
        'any.required':'Rejection reason is required'
    })
})