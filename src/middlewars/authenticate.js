import createHttpError from 'http-errors';
import { SessionCollection } from '../models/session.js';
import { UserCollection } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer.toLowerCase() !== 'bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isExpired = new Date() > new Date(session.accessTokenValidUntil);
  if (isExpired) {
    await SessionCollection.findByIdAndDelete(session._id);
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    await SessionCollection.findByIdAndDelete(session._id);
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;
  next();
};
