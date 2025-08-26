import Joi from 'joi';
//import { objIdValidation } from '../utils/objIdValidation.js';

export const createPostContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^\+[1-9]\d{6,14}$/),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().pattern(/^\+[1-9]\d{6,14}$/),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export const validatePaginationSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  perPage: Joi.number().min(1).max(100).default(10),
  sortOrder: Joi.string().lowercase().valid('asc', 'desc').default('asc'),
  sortBy: Joi.string()
    .valid(
      '_id',
      'name',
      'phoneNumber',
      'email',
      'isFavorite',
      'contactType',
      'createdAt',
      'updatedAt',
    )
    .default('_id'),
  filter: {
    contactType: Joi.string().valid('work', 'home', 'personal'),
    isFavourite: Joi.boolean(),
  },
});
