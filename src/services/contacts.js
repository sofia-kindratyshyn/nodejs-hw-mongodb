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
  const contact = await contactsCollection.deleteOne({ _id: contactId });
  return contact;
}

export async function postContact(payload) {
  const contact = await contactsCollection.insertOne(payload);
  return contact;
}

export async function updateContact(id, payload) {
  const contact = await contactsCollection.findByIdAndUpdate(
    { _id: id },
    {
      update: true,
    },
    payload,
  );
  return contact;
}
