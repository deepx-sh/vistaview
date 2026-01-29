import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js'

import { reviewOwner, getPendingOwners } from '../controllers/admin.controller.js'

const router = express.Router();

router.get("/owners/pending", authMiddleware, authorizeRoles("admin"), getPendingOwners);
router.patch("/owners/:userId", authMiddleware, authorizeRoles('admin'), reviewOwner);

export default router;
