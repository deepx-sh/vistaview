import Joi from 'joi';

export const reviewReportSchema = Joi.object({
    adminNote: Joi.string().max(200).required().messages({
        'string.base': 'Admin note must be string',
        'string.empty': 'Admin note cannot be empty',
        'string.max': 'Admin note cannot exceed 300 characters',
        'any.required':'Admin note is required'
    })
})