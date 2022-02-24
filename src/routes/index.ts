import { Router } from 'express';
import v1Router from './v1';

const router = Router();

// ---------------------------------------------------------
// Global API version routes
// ---------------------------------------------------------
router.use('/v1', v1Router);

export default router;
