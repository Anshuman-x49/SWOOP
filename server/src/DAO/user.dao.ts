import type { Types } from "mongoose";
import { type IUser, userModel } from "../models/user.model.js";

// Data interface for creating a new user
interface CreateUserData {
  name: string;
  email: string;
  password?: string;
}

// Function to create a new user in the database
async function createUser(userData: CreateUserData): Promise<IUser> {
  return await userModel.create(userData);
}

// Function to find a user by their email address
async function findUserByEmail({
  email,
  select,
}: {
  email: string;
  select?: string;
}): Promise<IUser | null> {
  const query = userModel.findOne({ email });
  if (select) {
    query.select(select);
  }
  return await query.exec();
}

// Function to update a user's refresh token hash in the database
async function updateRefreshToken({
  userId,
  refreshTokenHash,
}: {
  userId: Types.ObjectId | string;
  refreshTokenHash: string | null;
}): Promise<IUser | null> {
  return await userModel
    .findByIdAndUpdate(userId, { refreshTokenHash }, { new: true })
    .exec();
}

// Function to retrieve a user by their unique identifier (ID)
async function getUserById({
  userId,
  select,
}: {
  userId: Types.ObjectId | string;
  select?: string;
}): Promise<IUser | null> {
  const query = userModel.findById(userId);
  if (select) {
    query.select(select);
  }
  return await query.exec();
}

export { createUser, findUserByEmail, updateRefreshToken, getUserById };
