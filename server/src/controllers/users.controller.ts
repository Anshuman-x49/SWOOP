import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { userModel } from "../models/user.model.js";

/**
 * GET /api/users/search?q=query
 * Search for users by name or email, excluding the requesting user
 */
export async function searchUsersController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const query = (req.query.q as string)?.trim() || "";

  if (!query) {
    return sendSuccess({
      res,
      statusCode: 200,
      message: "Users search results",
      data: { users: [] },
    });
  }

  // Escape special regex characters
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "i");

  const users = await userModel
    .find({
      _id: { $ne: userId },
      $or: [{ name: regex }, { email: regex }],
    })
    .select("_id name email")
    .limit(20)
    .exec();

  const formattedUsers = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
  }));

  return sendSuccess({
    res,
    statusCode: 200,
    message: "Users search results",
    data: { users: formattedUsers },
  });
}
