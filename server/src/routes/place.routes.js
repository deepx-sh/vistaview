import express from 'express';

import { createPlace, getPlaces, getPlaceById, updatePlace, deletePlace, approvePlace } from '../controllers/place.controller';

import { authMiddleware } from '../middlewares/auth.middleware';
import {authorizeRoles} from '../middlewares/role.middleware.js'
import validate from '../middlewares/validate.middleware.js';

import { createPlaceSchema, updatePlaceSchema } from '../validators/place.validators';

const router = express.Router();

// Public
router.get("/", getPlaces);
router.get("/:id", getPlaceById);

// Owner
router.post("/", authMiddleware, authorizeRoles("owner"), validate(createPlaceSchema), createPlace);
router.put("/:id", authMiddleware, authorizeRoles("owner"), validate(updatePlaceSchema), updatePlace);
router.delete("/:id", authMiddleware, authorizeRoles("owner"), deletePlace);

// Admin
router.patch("/:id/approve", authMiddleware, authorizeRoles("admin"), approvePlace);


export default router;