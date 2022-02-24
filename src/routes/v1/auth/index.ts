import { Router } from 'express';
import { RegisterRequest } from './register';
import { loginRequest } from './login';

const AuthRouter = Router();
AuthRouter.route('/register').post(RegisterRequest);
AuthRouter.route('/login').post(loginRequest);

export default AuthRouter;
