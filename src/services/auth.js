import createHttpError from 'http-errors';
import { UserCollection } from '../models/user.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../models/session.js';
import { randomBytes } from 'crypto';

const createSession = () => {
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

  const newSession = createSession();

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

  const newSession = createSession();

  return SessionCollection.create({
    userId: sessionId,
    ...newSession,
  });
};
