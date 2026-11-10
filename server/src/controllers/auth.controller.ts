import type { CookieOptions, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import {
  COOKIE_OPTIONS,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth.util.js";
import {
  createUser,
  findUserByEmail,
  getUserById,
  updateRefreshToken,
} from "../DAO/user.dao.js";
import type { Types } from "mongoose";

// Issue a refresh token for the user and set it in an HTTP-only cookie
const issueRefreshToken = async ({
  userId,
  res,
}: {
  userId: Types.ObjectId | string;
  res: Response;
}) => {
  // Generate refresh token
  const refreshToken = await generateRefreshToken({ userId });

  // Hash the refresh token before storing it in the database
  const salt = await bcryptjs.genSalt(10);
  const hashedRefreshToken = await bcryptjs.hash(refreshToken, salt);

  // Update refresh token in the database
  await updateRefreshToken({ userId, refreshTokenHash: hashedRefreshToken });

  // Set refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS as CookieOptions);
};

// Send authentication tokens (access and refresh) to the client
const sendAuthTokens = async (
  user: { _id: Types.ObjectId | string; name: string; email: string } | null,
  res: Response,
  status: number,
  messages: string,
) => {
  if (!user) {
    throw new Error("Cannot issue auth tokens without a user");
  }

  // Generate access and refresh tokens
  const accessToken = await generateAccessToken({ userId: user._id });
  await issueRefreshToken({ userId: user._id, res });

  return res.status(status).json({
    message: messages,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    },
  });
};

// User registration controller
const userRegisterController = async (req: Request, res: Response) => {
  try {
    // Extract user from request body
    const { name, email, password } = req.body;

    // Check if user already exists
    const isUserExists = await findUserByEmail({ email });
    if (isUserExists) {
      return res.status(400).json({
        message: "User already exists",
        errors: [
          {
            path: "email",
            msg: "Email is already registered",
          },
        ],
      });
    }

    // Hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Send response with user data and tokens
    return sendAuthTokens(newUser, res, 201, "User registered successfully");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// User login controller
const userLoginController = async (req: Request, res: Response) => {
  try {
    // Extract user from request body
    const { email, password } = req.body;

    // Check if user exists
    const user = await findUserByEmail({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        errors: [
          {
            path: "email",
            msg: "Email not found",
          },
        ],
      });
    }

    // Compare password
    const isPasswordvalid = await bcryptjs.compare(
      password,
      user.password || "",
    );
    if (!isPasswordvalid) {
      return res.status(401).json({
        message: "Invalid credentials",
        errors: [
          {
            path: "password",
            msg: "Invalid email or password",
          },
        ],
      });
    }

    // Send response with user data and tokens
    return sendAuthTokens(user, res, 200, "User logged in successfully");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// User logout controller
const userLogoutController = async (req: Request, res: Response) => {
  // Get the refresh token from the cookie
  const refreshToken: string | undefined = req.cookies?.refreshToken;

  // If no refresh token is provided, return an error response
  if (!refreshToken) {
    return res.status(401).json({
      message: "Invalid refresh token",
      errors: [
        {
          path: "refreshToken",
          msg: "Refresh token is required",
        },
      ],
    });
  }

  try {
    // Verify the refresh token and get the user ID
    const { userId } = await verifyRefreshToken({ token: refreshToken });

    // Get the user from the database and check if the refresh token matches
    const user = await getUserById({ userId, select: "+refreshTokenHash" });
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        message: "Invalid refresh token",
        errors: [
          {
            path: "refreshToken",
            msg: "Session expired or user not found",
          },
        ],
      });
    }

    // Compare the provided refresh token with the hashed refresh token in the database
    const isTokenValid = await bcryptjs.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!isTokenValid) {
      // Invalidate refresh token in database
      await updateRefreshToken({ userId: user._id, refreshTokenHash: null });
      
      // Clear refresh token cookie
      res.clearCookie("refreshToken", COOKIE_OPTIONS as CookieOptions);

      return res.status(401).json({
        message: "Invalid refresh token",
        errors: [
          {
            path: "refreshToken",
            msg: "Refresh token does not match active session",
          },
        ],
      });
    }

    // Invalidate refresh token in database
    await updateRefreshToken({ userId: user._id, refreshTokenHash: null });

    // Clear refresh token cookie
    res.clearCookie("refreshToken", COOKIE_OPTIONS as CookieOptions);

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
    ) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
        errors: [
          {
            path: "refreshToken",
            msg: error.message,
          },
        ],
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export {
  userRegisterController,
  userLoginController,
  userLogoutController,
  userLogoutController as userLogoutcontroller,
};
