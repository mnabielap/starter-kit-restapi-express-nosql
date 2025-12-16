import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { roles } from '../config/roles';
import { toJSON, paginate } from './plugins';
import { QueryResult } from './plugins/paginate.plugin';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  is_email_verified: boolean;
  isPasswordMatch(password: string): Promise<boolean>;
}

interface UserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true, // Used by toJSON plugin to hide password
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 */
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 */
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function () {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password!, 8);
  }
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;