import Joi from 'joi';

export const createReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot be more than 5',
        'any.required': 'Rating is required'
    }),
    comment: Joi.string().trim().min(10).max(1000).required().messages({
        'string.base': 'Comment must be a string',
        'string.empty': 'Comment cannot be empty',
        'string.min': 'Comment must be at least 10 characters long',
        'string.max': 'Comment cannot be more than 1000 characters long',
        'any.required':'Comment is required'
    }),
     images: Joi.array().items(
            Joi.object({
                url: Joi.string().uri().required().messages({
                    'string.base': 'Image URL must be a string',
                    'string.empty': 'Image URL cannot be empty',
                    'string.uri': 'Image must be a valid URL',
                    'any.required': 'Image URL is required'
                }),
                publicID: Joi.string().optional()
            })
        ).optional()
});

export const updateReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).optional().messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot be more than 5',
    }),

    comment: Joi.string().min(10).max(1000).optional().messages({
        'string.base': 'Comment must be a string',
        'string.empty': 'Comment cannot be empty',
        'string.min': 'Comment must be at least 10 characters long',
        'string.max': 'Comment cannot be more than 1000 characters long',
    }),

    images: Joi.array().items(
            Joi.object({
                url: Joi.string().uri().required().messages({
                    'string.base': 'Image URL must be a string',
                    'string.empty': 'Image URL cannot be empty',
                    'string.uri': 'Image must be a valid URL',
                    'any.required': 'Image URL is required'
                }),
                publicID: Joi.string().optional()
            })
        ).optional()
}).min(1).messages({
    'object.min': 'At least one field(rating, comment, images) must be provided for update',
})