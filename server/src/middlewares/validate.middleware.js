const validate = (schema) => (req, res, next) => {
    const dataToValidate = {
        ...req.body,
    }

    if (req.files && req.files.length > 0) {
        dataToValidate.images = req.files.map(file => ({
           url: file.path,
            publicID: file.filename
        }))
    }
    const { error } = schema.validate(dataToValidate, {
        abortEarly:false
    })

    if (error) {
        return res.status(400).json({
            message: "Validation error",
            errors:error.details.map((err)=>err.message)
        })
    }

    next();
};

export default validate;