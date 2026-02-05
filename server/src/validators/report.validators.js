import Joi from 'joi';

export const createReportSchema = Joi.object({
    targetType: Joi.string()
        .valid("review", "place")
        .required().messages({
            'any.required': 'Target type is required',
            'any.only': 'Target type must be either review or place',
        }),
    
    targetId: Joi.string().required().messages({
        'any.required': 'Target ID is required',
    }),

    reason: Joi.string()
        .valid("spam", "fake", "offensive", "misleading", "copyright", "other")
        .required().messages({
            'any.required': 'Reason is required',
            'string.base': 'Reason must be a string',
            'any.only': 'Reason must be one of spam, fake, offensive, misleading, copyright, other',
            'string.empty': 'Reason cannot be empty',
        }),
    
    message: Joi.string().max(300).messages({
        'string.max': 'Message cannot exceed 300 characters',
        'string.base': 'Message must be a string',
    })
})