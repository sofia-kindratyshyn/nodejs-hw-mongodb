import { model, Schema, Types } from 'mongoose';
import { UserCollection } from './user.js';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      default: 'personal',
      enum: ['work', 'home', 'personal'],
    },
    parentId: {
      type: Types.ObjectId,
      ref: UserCollection,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const contactsCollection = model('contacts', schema);
