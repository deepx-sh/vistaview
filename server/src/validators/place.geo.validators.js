import Joi from 'joi';

export const geoSearchSchema = Joi.object({
    lat: Joi.number().required().messages({
        'number.base': "lat should be a number",
        'any.required': 'lat is required'
    }),

    lng: Joi.number().required().messages({
        'number.base': "lng should be a number",
        'any.required': 'lng is required'
    }),

    distance: Joi.number().min(1).max(100).default(10).messages({
        'number.base': "distance should be a number",
        'number.min': "distance should be at least 1 km",
        'number.max': "distance should be at most 100 km",
    })
})