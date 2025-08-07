import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  deleteContactController,
  postContactController,
  updateContactController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', getContactsController);

router.get('/contacts/:contactId', getContactByIdController);

router.delete('/contacts/:contactId', deleteContactController);

router.post('/contacts', postContactController);

router.put('/contacts/:contactId', updateContactController);

export default router;
