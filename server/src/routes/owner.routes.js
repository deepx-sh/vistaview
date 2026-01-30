import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { applyForOwner, deleteReply, replyToReview, updateReply } from '../controllers/owner.controller.js';
import { applyOwnerSchema } from '../validators/owner.validators.js';
import uploadOwnerDocs from '../config/multerOwnerDocs.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { replySchema } from '../validators/reply.validators.js';

const router = express.Router();

router.post("/apply", authMiddleware, uploadOwnerDocs.array("documents", 3), validate(applyOwnerSchema), applyForOwner);

router.post("/reviews/:reviewId/reply", authMiddleware, authorizeRoles("owner"), validate(replySchema), replyToReview);

router.put("/reviews/:reviewId/reply",authMiddleware,authorizeRoles("owner"),validate(replySchema),updateReply)

router.delete("/reviews/:reviewId/reply",authMiddleware,authorizeRoles("owner"),deleteReply)
export default router;