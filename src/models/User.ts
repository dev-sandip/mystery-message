import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
}
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}
const MessageSchema: Schema<Message> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required!"],
    },
    verifyCodeExpires: {
      type: Date,
      required: [true, "Verify code expires is required!"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
export default UserModel;
