import mongoose, { Schema, Document } from 'mongoose';
import { toJSON } from './plugins';
import { tokenTypes } from '../config/tokens';

export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;