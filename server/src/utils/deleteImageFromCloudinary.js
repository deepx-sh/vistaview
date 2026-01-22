import cloudinary from "../config/cloudinary.js";

const deleteImageFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error("Failed to delete image from Cloudinary")
    }
};

export default deleteImageFromCloudinary;