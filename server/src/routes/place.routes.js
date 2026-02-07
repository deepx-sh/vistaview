import express from 'express';

import { createPlace, getPlaces, getPlaceById, updatePlace, deletePlace, approvePlace } from '../controllers/place.controller.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';
import {authorizeRoles} from '../middlewares/role.middleware.js'
import validate from '../middlewares/validate.middleware.js';

import { createPlaceSchema, updatePlaceSchema } from '../validators/place.validators.js';
import { searchPlaces } from '../controllers/place.search.controller.js';
import { searchPlaceSchema } from '../validators/place.search.validators.js';
import { geoSearchSchema } from '../validators/place.geo.validators.js';
import { nearbyPlaces } from '../controllers/place.geo.controller.js';
import uploadPlaceImages from '../config/multerPlace.js';
import { parseMultiPartData } from '../middlewares/parseMultiPartData.middleware.js';

const router = express.Router();

// Public
router.get("/", getPlaces);
router.get("/search", validate(searchPlaceSchema), searchPlaces)
router.get("/nearby",validate(geoSearchSchema),nearbyPlaces)
router.get("/:id", getPlaceById);
// Owner
router.post("/", authMiddleware, authorizeRoles("owner"), uploadPlaceImages.array("images",5),parseMultiPartData,validate(createPlaceSchema), createPlace);
router.put("/:id", authMiddleware, authorizeRoles("owner"),uploadPlaceImages.array("images",5), validate(updatePlaceSchema), updatePlace);
router.delete("/:id", authMiddleware, authorizeRoles("owner"), deletePlace);

// Admin
router.patch("/:id/approve", authMiddleware, authorizeRoles("admin"), approvePlace);


export default router;