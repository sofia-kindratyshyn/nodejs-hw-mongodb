import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  deleteContactController,
  postContactController,
  patchContactController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', getContactsController);

router.get('/contacts/:contactId', getContactByIdController);

router.delete('/contacts/:contactId', deleteContactController);

router.post('/contacts', postContactController);

router.patch('/contacts/:contactId', patchContactController);

export default router;
