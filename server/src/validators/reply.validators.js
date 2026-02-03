import Joi from 'joi';

export const replySchema = Joi.object({
    text: Joi.string().min(5).max(1000).required().messages({
        'string.base': 'Reply text must be a string',
        'string.empty': 'Reply text cannot be empty',
        'string.min': 'Reply text must be at least 5 characters long',
        'string.max': 'Reply text cannot exceed 1000 characters',
        'any.required':'Reply text is required'
    })
})