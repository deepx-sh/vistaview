import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";


const placesStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "vistaview/places",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [
            {
                width: 1200,
                height: 800,
                crop: 'limit',
                quality:'auto'
           }
        ]
    }
});

const uploadPlaceImages = multer({
    storage: placesStorage,
    limits: {
        fileSize:5*1024*1024
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"),false)
        } else {
            cb(null,true)
        }
    }
});

export default uploadPlaceImages;