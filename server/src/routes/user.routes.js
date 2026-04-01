import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import avatarUpload from '../config/multerAvatar.js';

import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from '../controllers/user.controller.js';

import { updateProfileSchema } from '../validators/user.validators.js';
import { changePasswordSchema } from '../validators/auth.validators.js';
import { changePassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.get("/me", authMiddleware, getProfile);

router.put("/me", authMiddleware, validate(updateProfileSchema), updateProfile);

router.put("/me/avatar", authMiddleware, avatarUpload.single("avatar"), uploadAvatar);

router.delete("/me/avatar", authMiddleware, deleteAvatar);
router.put("/me/change-password",authMiddleware,validate(changePasswordSchema),changePassword)

export default router