import { model, Schema, Types } from 'mongoose';
import { UserCollection } from './user.js';

const schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: UserCollection,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SessionCollection = model('session', schema);
