import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  refreshTokenHash?: string | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model<IUser>("user", userSchema);

export { userModel };  export type { IUser };

