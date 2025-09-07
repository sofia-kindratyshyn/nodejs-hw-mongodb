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
import { authenticate } from '../middlewars/authenticate.js';
import { checkPermissions } from '../middlewars/checkPermissions.js';
import { uploads } from '../middlewars/multer.js';

const router = Router();

router.use('/contacts', authenticate);

router.use('/contscts/:contactId', checkPermissions);

router.get('/contacts', getContactsController);

router.get('/contacts/:contactId', getContactByIdController);

router.delete('/contacts/:contactId', deleteContactController);

router.post(
  '/contacts',
  uploads.single('photo'),
  validateBody(createPostContactSchema),
  postContactController,
);

router.patch(
  '/contacts/:contactId',
  uploads.single('photo'),
  validateBody(updateContactSchema),
  patchContactController,
);

export default router;
