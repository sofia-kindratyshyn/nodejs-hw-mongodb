import { calculateQueryInfo } from '../utils/calculateQuery.js';
import { contactsCollection } from '../models/model.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
}) {
  const limit = perPage;
  const skip = limit * (page - 1);

  const baseFilter = {};

  if (filter.userId) {
    baseFilter.userId = filter.userId;
  }
  if (filter.contactType) baseFilter.contactType = filter.contactType;
  if (filter.isFavourite) baseFilter.isFavourite = filter.isFavourite;
  if (filter.name) baseFilter.name = { $regex: filter.name, $options: 'i' };

  const contactsCount = await contactsCollection.countDocuments(baseFilter);

  let contacts = await contactsCollection
    .find(baseFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();

  if (contactsCount == 0) {
    return {
      contacts: [],
    };
  } else {
    const additionalInfo = await calculateQueryInfo(
      contactsCount,
      page,
      perPage,
    );

    return {
      contacts,
      ...additionalInfo,
    };
  }
}

export async function getContactById(contactId, userId) {
  const contact = await contactsCollection.findOne({ _id: contactId, userId });
  return contact;
}

export async function deleteContact(contactId, userId) {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
}

export async function postContact(payload) {
  const contact = await contactsCollection.create(payload);
  return contact;
}

export async function patchContact(contactId, payload, userId, options = {}) {
  const contact = await contactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );

  return contact;
}
