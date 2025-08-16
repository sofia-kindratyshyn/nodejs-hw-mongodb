import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const validateContactId = (id) => {
  if (!isValidObjectId(id)) throw createHttpError(403, 'Invalid id!');
  return id;
};
