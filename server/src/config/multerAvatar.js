import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import cloudinary from './cloudinary.js';

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "vistaview/avatars",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [
            {
                width: 300,
                height: 300,
                crop: 'fill',
                gravity: 'face',
                quality:'auto'
           }
        ]
    }
});

const uploadAvatar = multer({
    storage: avatarStorage,
    limits: {
        fileSize:2*1024*1024
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"),false)
        } else {
            cb(null,true)
        }
    }
});

export default uploadAvatar;