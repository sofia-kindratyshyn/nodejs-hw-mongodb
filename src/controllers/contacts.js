import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  postContact,
  deleteContact,
  patchContact,
} from '../services/contacts.js';
import { validateContactId } from '../validation/validateContactId.js';
import { validateQuery } from '../middlewars/validateBody.js';
import { validatePaginationSchema } from '../validation/validateSchemas.js';

export const getContactsController = async (req, res) => {
  const parentId = req.user._id;
  const { page, perPage, sortOrder, sortBy, ...other } = req.query;
  await validateQuery(validatePaginationSchema);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter: { ...other, parentId },
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const id = validateContactId(contactId);
  const contact = await getContactById(id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contactToDelete = await deleteContact(contactId);

  if (!contactToDelete) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json(204);
};

export const postContactController = async (req, res) => {
  const contact = await postContact({
    ...req.body,
    parentId: req.body.parentId ?? req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await patchContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
