import express from 'express';
import { createReport } from '../controllers/report.controller.js';
import { createReportSchema } from '../validators/report.validators.js';
import validate from '../middlewares/validate.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/", authMiddleware, validate(createReportSchema), createReport);

export default router;
