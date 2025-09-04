import { Router } from 'express';
import {
  authLoginController,
  authRegisterController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  sendResetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewars/validateBody.js';
import {
  loginValidationSchema,
  registerValidationSchema,
  resetPasswordValidation,
  sendResetEmailBodyValidation,
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

authRouter.post('/auth/logout', logoutController);

authRouter.post('/auth/refresh', refreshTokenController);

authRouter.post(
  '/auth/send-reset-email',
  validateBody(sendResetEmailBodyValidation),
  sendResetEmailController,
);

authRouter.post(
  '/auth/reset-pwd',
  validateBody(resetPasswordValidation),
  resetPasswordController,
);
