import Joi from 'joi';

export const searchPlaceSchema = Joi.object({
    q: Joi.string().allow(""),
    
    category: Joi.string().valid("beach", "temple", "hill", "hotel", "heritage", "city", "nature"),
    
    city: Joi.string(),
    
    minRating: Joi.number().min(1).max(5),
    
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    
    page: Joi.number().min(1).default(1),
    limit:Joi.number().min(1).max(100).default(10)
})