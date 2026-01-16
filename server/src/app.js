import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import placeRoutes from './routes/place.routes.js'
import { ApiError } from './utils/ApiError.js';
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
app.use("/api/v1/places",placeRoutes)
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
export default app;