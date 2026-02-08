import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlist.controller.js';

const router = express.Router();


router.post("/:placeId", authMiddleware, addToWishlist);
router.delete("/:placeId", authMiddleware, removeFromWishlist);
router.get("/", authMiddleware, getWishlist);

export default router;