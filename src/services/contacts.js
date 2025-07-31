import { contactsCollection } from '../db/model.js';

export async function getAllContacts() {
  const contacts = await contactsCollection.find();
  console.log(contacts);
  return contacts;
}
