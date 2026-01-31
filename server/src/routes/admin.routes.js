import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js'

import { reviewOwner, getPendingOwners } from '../controllers/admin.controller.js'

import { getPendingPlaces,approvePlace,rejectPlace,toggleFeaturePlace,getAllPlacesAdmin } from '../controllers/admin.places.controller.js';
import { rejectPlaceSchema,featurePlaceSchema } from '../validators/admin.place.validators.js';
import validate from '../middlewares/validate.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware';
const router = express.Router();

router.get("/owners/pending", authMiddleware, authorizeRoles("admin"), getPendingOwners);
router.patch("/owners/:userId", authMiddleware, authorizeRoles('admin'), reviewOwner);


router.get("/places/pending", authMiddleware, authorizeRoles("admin"), getPendingPlaces);
router.get("/places", authMiddleware, authorizeRoles("admin"), getAllPlacesAdmin);
router.patch("/places/:id/approve", authMiddleware, authorizeRoles("admin"), approvePlace);
router.patch("/places/:id/reject", authMiddleware, authorizeRoles("admin"), validate(rejectPlaceSchema), rejectPlace);
router.patch("/places/:id/feature", authMiddleware, authorizeRoles("admin"), validate(featurePlaceSchema), toggleFeaturePlace);

export default router;