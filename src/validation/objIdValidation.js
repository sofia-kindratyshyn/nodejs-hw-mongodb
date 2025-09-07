import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const objIdValidation = Joi.string().custom((value, helper) => {
  const isValid = isValidObjectId(value);
  if (!isValid) return helper.message('Not valid objectId');
  return value;
});
