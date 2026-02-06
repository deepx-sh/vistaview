import Joi from 'joi';

export const applyOwnerSchema = Joi.object({
    businessName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Business name must be at least 3 characters',
            'string.max': 'Business name cannot exceed 100 characters',
            'string.empty': 'Business name cannot be empty',
            'string.base': 'Business name must be a string',
            'any.required': 'Business name is required'
        }),
    businessAddress: Joi.string()
        .trim()
        .min(10)
        .max(300)
        .required()
        .messages({
        'string.min': 'Business address must be at least 10 characters',
            'string.max': 'Business address cannot exceed 300 characters',
            'string.empty': 'Business address cannot be empty',
            'string.base': 'Business address must be a string',
            'any.required': 'Business address is required'
        }),
    
    contactNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.pattern.base': 'Contact number must be a valid 10-digit number',
            'any.required':'Contact Number is required'
        }),
    
    documents: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().required().messages({
                'string.base': 'Document URL must be a string',
                'string.empty': 'Document URL cannot be empty',
                'string.uri': 'Document URL must be a valid URL',
                'any.required':'Document URL is required'
            }),
            publicId: Joi.string().required().messages({
                'string.base': 'Document publicId must be a string',
                'string.empty': 'Document publicId cannot be empty',
                'any.required': 'Document publicId is required'
            })
        }),
    ),

    status: Joi.string().valid("not_applied", "pending", "approved", "rejected")
        .default("not_applied")
        .messages({
            'any.only': 'Invalid owner verification status',
        }),
    
    appliedAt: Joi.date().optional(),
    approvedAt: Joi.date().optional(),
    rejectedReason: Joi.string().max(200).optional().messages({
        'string.base': 'Rejection reason must be a string',
        'string.max': 'Rejection reason cannot exceed 200 characters',
    })
})