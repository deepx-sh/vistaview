import "dotenv/config";

const REQUIRED_ENV_VARS = [
    "NODE_ENV",
    "MONGODB_URI",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_ACCESS_TOKEN_EXPIRY",
    "JWT_REFRESH_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_EXPIRY",
    "JWT_RESET_PASSWORD_SECRET",
    "JWT_RESET_PASSWORD_SECRET_EXPIRE",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_API_KEY",
    "BREVO_SMTP_HOST",
    "BREVO_SMTP_PORT",
    "BREVO_API_KEY",
    "BREVO_SMTP_PASS",
    "BREVO_FROM_EMAIL",
    "FRONTEND_URL_PROD"
]

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
    console.error("Missing required environment variable");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("Server cannot start. Please check your .env file");
    process.exit(1);
    
}
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})