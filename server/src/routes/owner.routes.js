import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { applyForOwner } from '../controllers/owner.controller.js';
import { applyOwnerSchema } from '../validators/owner.validators.js';
import uploadOwnerDocs from '../config/multerOwnerDocs.js';

const router = express.Router();

router.post("/apply", authMiddleware, uploadOwnerDocs.array("documents", 3), validate(applyOwnerSchema), applyForOwner);

export default router;