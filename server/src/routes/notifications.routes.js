import express from 'express';
import { authMiddleware } from './../middlewares/auth.middleware';
import { getNotifications, markAsRead } from '../controllers/notifications.controller';

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:id/read", authMiddleware, markAsRead);

export default router;