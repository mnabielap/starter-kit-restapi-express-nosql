import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { User } from '../models';
import { IUser } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { QueryResult } from '../models/plugins/paginate.plugin';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<IUser>}
 */
export const createUser = async (userBody: any): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user as unknown as IUser;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter + search params (search, scope)
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: any, options: any): Promise<QueryResult> => {
  const { search, scope, ...restFilter } = filter;
  const mongoFilter: any = { ...restFilter };

  if (search) {
    const searchRegex = new RegExp(search, 'i'); // Case insensitive regex
    const isObjectId = mongoose.Types.ObjectId.isValid(search);
    
    // Logic for different scopes
    if (scope === 'all') {
      const orConditions: any[] = [
        { name: searchRegex },
        { email: searchRegex }
      ];
      if (isObjectId) {
        orConditions.push({ _id: search });
      }
      mongoFilter.$or = orConditions;
    } 
    else if (scope === 'name') {
      mongoFilter.name = searchRegex;
    } 
    else if (scope === 'email') {
      mongoFilter.email = searchRegex;
    } 
    else if (scope === 'id') {
      if (isObjectId) {
        mongoFilter._id = search;
      } else {
        mongoFilter._id = new mongoose.Types.ObjectId();
      }
    }
  }

  const users = await User.paginate(mongoFilter, options);
  return users;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IUser | null>}
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUser | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<IUser>}
 */
export const updateUserById = async (userId: string, updateBody: any): Promise<IUser> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, user._id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IUser>}
 */
export const deleteUserById = async (userId: string): Promise<IUser> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};