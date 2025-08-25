import createHttpError from 'http-errors';
import { contactsCollection } from '../models/model.js';

export const checkPermissions = async (req, res, next) => {
  const contact = await contactsCollection.findById(req.params.contactId);

  if (!contact?.parentId?.equals(req.user._id)) {
    throw createHttpError(403, 'It is not your contact');
  }

  next();
};
