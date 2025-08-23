import { Router } from 'express';
import {
  authLoginController,
  authRegisterController,
  refreshTokenController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewars/validateBody.js';
import {
  loginValidationSchema,
  registerValidationSchema,
} from '../validation/authValidation.js';

export const authRouter = Router();

authRouter.post(
  '/auth/register',
  validateBody(registerValidationSchema),
  authRegisterController,
);

authRouter.post(
  '/auth/login',
  validateBody(loginValidationSchema),
  authLoginController,
);

authRouter.post('/auth/refresh', refreshTokenController);
