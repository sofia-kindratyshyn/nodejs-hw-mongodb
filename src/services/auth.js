import createHttpError from 'http-errors';
import { UserCollection } from '../models/user.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../models/session.js';
import { randomBytes } from 'crypto';
import { sendMail } from '../utils/sendEmailTransporter.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnv.js';

const createSession = async () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 60 * 15 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 30 * 1000),
  };
};

export const registerUser = async (payload) => {
  const emailExist = await UserCollection.findOne({ email: payload.email });
  if (emailExist) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const loginedUser = await UserCollection.findOne({
    email: payload.email,
  });
  if (!loginedUser) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, loginedUser.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionCollection.deleteOne({ userId: loginedUser._id });

  const newSession = await createSession();

  return SessionCollection.create({
    userId: loginedUser._id,
    ...newSession,
  });
};

export const refreshToken = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = new Date() > session.refreshTokenValidUntil;

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({
    _id: sessionId,
  });

  const newSession = await createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const sendResetEmail = async (email) => {
  try {
    const user = await UserCollection.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const jwtToken = jwt.sign(
      {
        sub: `${user._id}`,
        email: `${user.email}`,
      },
      getEnvVar('JWT_SECRET'),
      {
        expiresIn: '5m',
      },
    );

    return await sendMail(jwtToken, email, user);
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (password, token) => {
  const encodedToken = await jwt.decode(token);
  const user = await UserCollection.findOne({
    _id: encodedToken.sub,
    email: encodedToken.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const isPasswordNew = await bcrypt.compare(password, user.password);

  if (isPasswordNew) {
    throw createHttpError(
      400,
      'New password must be different from the old one.',
    );
  }

  if (Date.now() > encodedToken.exp * 1000) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.findByIdAndUpdate(encodedToken.sub, {
    password: hashedPassword,
  });

  await SessionCollection.deleteOne({ userId: encodedToken.sub });
};
