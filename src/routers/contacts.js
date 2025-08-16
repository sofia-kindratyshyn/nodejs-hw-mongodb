import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  deleteContactController,
  postContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewars/validateBody.js';
import {
  createPostContactSchema,
  updateContactSchema,
} from '../validation/validateSchemas.js';

const router = Router();

router.get('/contacts', getContactsController);

router.get('/contacts/:contactId', getContactByIdController);

router.delete('/contacts/:contactId', deleteContactController);

router.post(
  '/contacts',
  validateBody(createPostContactSchema),
  postContactController,
);

router.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema),
  patchContactController,
);

export default router;
