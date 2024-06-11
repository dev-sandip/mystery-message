import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  try {
    const { username, email, password } = await req.body.json();
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername?.isVerified) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Username already exists with this email address",
        },
        {
          status: 400,
        }
      );
    }
    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
    });
    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail?.isVerified) {
        return NextResponse.json(
          {
            success: false,
            status: 400,
            message: "Email already exists",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.password = hashedPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpires = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifiedByEmail.save();
      }
    }

    if (existingUserVerifiedByEmail) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (!emailResponse.success) {
        return NextResponse.json(
          {
            success: false,
            status: 500,
            message: emailResponse.message,
          },
          {
            status: 500,
          }
        );
      }
      return NextResponse.json(
        {
          success: true,
          status: 200,
          message: "User registered successfully",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: JSON.stringify(error),
      },
      {
        status: 500,
      }
    );
  }
};
