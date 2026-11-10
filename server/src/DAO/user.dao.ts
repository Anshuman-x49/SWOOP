import type { Types } from "mongoose";
import { type IUser, userModel } from "../models/user.model.js";

interface CreateUserData {
  name: string;
  email: string;
  password?: string;
}

async function createUser(userData: CreateUserData): Promise<IUser> {
  return await userModel.create(userData);
}

async function findUserByEmail({
  email,
}: {
  email: string;
}): Promise<IUser | null> {
  return await userModel.findOne({ email }).select("+password").exec();
}

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
