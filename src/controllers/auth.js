import {
  loginOrSignupWithGoogle,
  loginUser,
  logout,
  refreshToken,
  registerUser,
  resetPassword,
  sendResetEmail,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

export const authRegisterController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const authLoginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.accessTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshTokenController = async (req, res) => {
  const session = await refreshToken({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.accessTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) await logout(req.cookies.sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  return res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  await sendResetEmail(req.body.email);
  return res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body.password, req.body.token);
  return res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
