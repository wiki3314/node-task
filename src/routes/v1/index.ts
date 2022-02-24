import { Router } from 'express';

import AuthRouter from './auth';

const v1Router = Router();

// ---------------------------------------------------------
// V1 routes
// ---------------------------------------------------------

v1Router.use('/auth', AuthRouter);

export default v1Router;
