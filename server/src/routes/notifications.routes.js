import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotification } from '../controllers/notifications.controller.js';

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:id/read", authMiddleware, markAsRead);
router.patch("/read-all", authMiddleware, markAllAsRead);
router.delete("/:id", authMiddleware, deleteNotification);
router.delete("/", authMiddleware, clearAllNotification);

export default router;