import { Router } from 'express';
import * as tagsController from './controller.js';

const router = Router();

// GET /api/v1/tags — public, no auth, no validation
router.get('/', tagsController.getTags);

export default router;
