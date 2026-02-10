import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import placeRoutes from './routes/place.routes.js'
import userRoutes from './routes/user.routes.js'
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';
import ownerRoutes from './routes/owner.routes.js'
import reportRoutes from './routes/report.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import { ApiError } from './utils/ApiError.js';
import multer from 'multer';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));


app.get("/", (req, res) => {
    return res.send("<h1>Welcome to VistaView API</h1>")
});

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/places", placeRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/wishlist",wishlistRoutes)
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/reports",reportRoutes)
app.use("/api/v1/owners", ownerRoutes);
app.use("/api/v1/admin",adminRoutes)

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        error: "Limit Exceeded",
        message:"A maximum of 5 images are allowed per place and 3 images per review"
      })
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File is too large",
        message:"File is too large. Max limit for Place, Review images is 5MB, Profile picture is 2MB"
      })
    }
  }
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
export default app;