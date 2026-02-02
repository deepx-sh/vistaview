import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js'

import { reviewOwner, getPendingOwners } from '../controllers/admin.controller.js'

import { getPendingPlaces, approvePlace, rejectPlace, toggleFeaturePlace, getAllPlacesAdmin } from '../controllers/admin.places.controller.js';
import { getFlaggedReviews, getAllReviewsAdmin, adminDeleteReview, restoreReview, hardDeleteReview } from '../controllers/admin.review.controller.js';
import { getAllUsers, blockUser, unblockUser } from '../controllers/admin.user.controller.js';
import { getPendingReports, getAllReports, resolveReport, rejectReport } from '../controllers/admin.report.controller.js';
import { getAdminDashboard } from '../controllers/admin.dashboard.controller.js';
import { reviewReportSchema } from '../validators/admin.report.validators.js';
import { rejectPlaceSchema,featurePlaceSchema } from '../validators/admin.place.validators.js';
import validate from '../middlewares/validate.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware';
import { unblockUser } from './../controllers/admin.user.controller';
import { blockUserSchema } from '../validators/admin.user.validators.js';
const router = express.Router();

router.get("/owners/pending", authMiddleware, authorizeRoles("admin"), getPendingOwners);
router.patch("/owners/:userId", authMiddleware, authorizeRoles('admin'), reviewOwner);


router.get("/places/pending", authMiddleware, authorizeRoles("admin"), getPendingPlaces);
router.get("/places", authMiddleware, authorizeRoles("admin"), getAllPlacesAdmin);
router.patch("/places/:id/approve", authMiddleware, authorizeRoles("admin"), approvePlace);
router.patch("/places/:id/reject", authMiddleware, authorizeRoles("admin"), validate(rejectPlaceSchema), rejectPlace);
router.patch("/places/:id/feature", authMiddleware, authorizeRoles("admin"), validate(featurePlaceSchema), toggleFeaturePlace);


router.get("/reviews/flagged", authMiddleware, authorizeRoles("admin"), getFlaggedReviews);
router.get("/reviews", authMiddleware, authorizeRoles("admin"), getAllReviewsAdmin);
router.patch("/reviews/:id/delete", authMiddleware, authorizeRoles("admin"), adminDeleteReview);
router.patch("/reviews/:id/restore", authMiddleware, authorizeRoles("admin"), restoreReview);
router.delete("/reviews/:id", authMiddleware, authorizeRoles("admin"), hardDeleteReview);


router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
router.patch("/users/:id/block", authMiddleware, authorizeRoles("admin"), validate(blockUserSchema), blockUser);
router.patch("/users/:id/unblock", authMiddleware, authorizeRoles("admin"), unblockUser)


router.get("/reports/pending", authMiddleware, authorizeRoles("admin"), getPendingReports);
router.get("/reports", authMiddleware, authorizeRoles("admin"), getAllReports);
router.patch("/reports/:id/resolve", authMiddleware, authorizeRoles("admin"), validate(reviewReportSchema), resolveReport);
router.patch("/reports/:id/reject",authMiddleware, authorizeRoles("admin"),validate(reviewReportSchema),rejectReport)


router.get("/dashboard",authMiddleware,authorizeRoles("admin"),getAdminDashboard)
export default router;