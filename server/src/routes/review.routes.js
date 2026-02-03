import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js'
import validate  from '../middlewares/validate.middleware.js'
import uploadPlaceImages from '../config/multerPlace.js';

import { addReview, updateReview, deleteReview, likeReview } from '../controllers/review.controller.js';

import { createReviewSchema, updateReviewSchema } from '../validators/review.validators.js';

const router = express.Router();

router.post("/:placeId", authMiddleware, uploadPlaceImages.array("images", 3), validate(createReviewSchema), addReview);

router.put("/:reviewId", authMiddleware, uploadPlaceImages.array("images", 3), validate(updateReviewSchema), updateReview);

router.delete("/:reviewId", authMiddleware, deleteReview);
router.post("/:reviewId/like", authMiddleware, likeReview);

export default router;