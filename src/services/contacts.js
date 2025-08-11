import { contactsCollection } from '../models/model.js';

export async function getAllContacts() {
  const contacts = await contactsCollection.find();
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await contactsCollection.findById(contactId);
  return contact;
}

export async function deleteContact(contactId) {
  const contact = await contactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
}

export async function postContact(payload) {
  const contact = await contactsCollection.insertOne(payload);
  return contact;
}

export async function patchContact(contactId, payload, options = {}) {
  const contact = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true },
  );

  return contact;
}
