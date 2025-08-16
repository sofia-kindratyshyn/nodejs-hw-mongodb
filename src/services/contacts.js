import { calculateQueryInfo } from '../utils/calculateQuery.js';
import { contactsCollection } from '../models/model.js';

export async function getAllContacts({
  page,
  perPage,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
}) {
  const limit = perPage;
  const skip = perPage * (page - 1);
  const contactsCount = await contactsCollection.countDocuments();

  const contacts = await contactsCollection
    .find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();
  const contactsQuery = await contactsCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const additionalInfo = await calculateQueryInfo(contactsCount, page, perPage);

  return {
    contacts,
    ...additionalInfo,
  };
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
