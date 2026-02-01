import express from 'express';
import { createReport } from '../controllers/report.controller';
import { createReportSchema } from '../validators/report.validators';
import validate from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post("/", authMiddleware, validate(createReportSchema), createReport);

export default router;
