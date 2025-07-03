import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

export const generateSignedUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
        type: 'upload',
        sign_url: true,
        resource_type: 'raw',
        ...options
    });
};

export default cloudinary;
