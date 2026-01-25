import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const ownerDocsStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "vistaview/owner-documents",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png", "pdf"],
        transformation: [
            {
                quality:"auto"
            }
        ]
    }
});


const uploadOwnerDocs = multer({
    storage: ownerDocsStorage,
    limits: {
        fileSize:5*1024*1024
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf"
        ]

        if (!allowed.includes(file.mimetype)) {
            cb(new Error("Only images and PDF documents are allowed"),false)
        } else {
            cb(null,true)
        }
    }
});

export default uploadOwnerDocs;