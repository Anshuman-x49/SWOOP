import type { CookieOptions, Request, Response } from "express";
import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { COOKIE_OPTIONS, generateAccessToken, generateRefreshToken } from "../utils/auth.util.js";

const userRegisterController = async (req: Request, res: Response) => {
  try {
    // Extract user from request body
    const { name, email, password } = req.body;

    // Check if user already exists
    const isUserExists = await userModel.findOne({ email });
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
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // issue JWT token
    const accessToken = await generateAccessToken({ userId: newUser._id });
    const refreshToken = await generateRefreshToken({ userId: newUser._id });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS as CookieOptions);

    // Send response with user data and tokens
    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        accessToken
      }
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export { userRegisterController };
