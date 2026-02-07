import Joi from 'joi';

export const createPlaceSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
        'string.base': 'Place name is required',
        'string.empty': 'Place name cannot be empty',
        'string.min': 'Place name must be at least 3 characters long',
        'string.max': 'Place name must be at most 100 characters long',
        'any.required': 'Place name is required'
    }),

    description: Joi.string().trim().min(20).max(2000).required().messages({
        'string.base': 'Description must be a string',
        'string.empty': "Description cannot be empty",
        'string.min': 'Description must be at least 20 characters long',
        'string.max': 'Description must be at most 2000 characters long',
        'any.required': 'Description is required'
    }),

    category: Joi.string().valid("beach", "temple", "hill", "hotel", "heritage", "city", "nature").required().messages({
        'any.only': 'Category must be one of beach, temple, hill, hotel, heritage, city, nature',
        'any.required': 'Category is required'
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
    ),

    location: Joi.object({
        type: Joi.string().valid("Point").required(),
        coordinates: Joi.array().length(2).items(Joi.number()).required().messages({
            'array.base': 'Coordinates must be an array',
            'array.length': 'Coordinates must have exactly 2 elements [lng,lat]',
            'any.required': 'Coordinates are required'
        }),
        address: Joi.string().trim().required().messages({
            'string.base': 'Address must be a string',
            'string.empty': 'Address cannot be empty',
            'any.required': 'Address is required'
        }),
        city: Joi.string().trim().required().messages({
            'string.base': 'City must be a string',
            'string.empty': 'City cannot be empty',
            'any.required': 'City is required'
        }),
        state: Joi.string().trim().required().messages({
            'string.base': 'State must be a string',
            'string.empty': 'State cannot be empty',
            'any.required': 'State is required'
        })
    }).required().messages({
        'any.required': 'Location is required',
        'object.base': 'Location must be an object',
    }),

    pricing: Joi.object({
        min: Joi.number().min(0).optional().messages({
            'number.base': 'Minimum pricing must be a number',
            'number.min': 'Minimum pricing cannot be negative',
        }),
        max: Joi.number().min(0).optional().messages({
            'number.base': 'Maximum pricing must be a number',
            'number.min': 'Maximum pricing cannot be negative',
        })
    }).optional(),
    
    timings: Joi.object({
        open: Joi.string().optional().messages({
            'string.base': 'Opening time must be a string',
        }),
        close: Joi.string().optional().messages({
            'string.base': 'Closing time must be a string',
        })
    }).optional(),

    bestTimeToVisit: Joi.string().trim().max(200).optional().messages({
        'string.base': 'Best time to visit must be a string',
        'string.max': 'Best time to visit must be at most 200 characters long',
    })
});

export const updatePlaceSchema = createPlaceSchema.fork(
    Object.keys(createPlaceSchema.describe().keys),
    (schema) => schema.optional()
).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});