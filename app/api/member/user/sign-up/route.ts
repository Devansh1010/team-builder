import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user_models/user.model";
import UserData from "@/models/allUsers.model";
import { createResponse, StatusCode } from "@/lib/createResponce";
import { sendVerification } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { username, email, password, avatar } = await request.json();

        if (!username || !email || !password) {
            return createResponse(
                { success: false, message: "Missing fields" },
                StatusCode.BAD_REQUEST
            );
        }

        const validatedUsername = username.trim().toLowerCase();
        const validatedEmail = email.trim().toLowerCase();
        const validatedAvatar = avatar?.trim() || null;


        const existingUserVerifiedByUsername = await User.findOne({
            username: validatedUsername,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return createResponse(
                { success: false, message: "Username already taken" },
                StatusCode.BAD_REQUEST
            );
        }

        const existingUser = await User.findOne({ email: validatedEmail });

        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        let userDoc;

        // IF USER EXISTS BUT NOT VERIFIED → UPDATE Data

        if (existingUser) {
            if (existingUser.isVerified) {
                return createResponse(
                    { success: false, message: "User already verified" },
                    StatusCode.FORBIDDEN
                );
            }

            userDoc = await User.findOneAndUpdate(
                { email: validatedEmail },
                {
                    username: validatedUsername,
                    password: hashedPassword,
                    avatar: validatedAvatar,
                    verifyCode,
                    verifyExpiry: new Date(Date.now() + 3600000),
                },
                { new: true, session }
            );

            if (!userDoc) {
                await session.abortTransaction();
                return createResponse(
                    { success: false, message: "User not updated" },
                    StatusCode.CONFLICT
                );
            }
        }

        // CREATE NEW USER 

        else {
            userDoc = await User.create(
                [
                    {
                        username: validatedUsername,
                        email: validatedEmail,
                        password: hashedPassword,
                        avatar: validatedAvatar,
                        verifyCode,
                        verifyExpiry: new Date(Date.now() + 3600000),
                        isVerified: false,
                    },
                ],
                { session }
            );

            // ? Inquirey -----------------------------------------
            console.log(userDoc)

            userDoc = userDoc[0];

        }

        // UPDATE USERDATA 

        const updatedUserData = await UserData.findOneAndUpdate(
            { email: validatedEmail },
            { username: validatedUsername },
            { new: true, session }
        );

        if (!updatedUserData) {
            await session.abortTransaction();
            return createResponse(
                { success: false, message: "UserData update failed" },
                StatusCode.CONFLICT
            );
        }

        // SEND VERIFICATION EMAIL

        const emailResult = await sendVerification(validatedEmail, validatedUsername, verifyCode);

        if (!emailResult.success) {
            await session.abortTransaction();
            return createResponse(
                { success: false, message: emailResult.message },
                StatusCode.INTERNAL_ERROR
            );
        }

        // EVERYTHING SUCCESS → COMMIT
        await session.commitTransaction();
        session.endSession();

        return createResponse(
            { success: true, message: "Verification sent! Please verify." },
            StatusCode.OK
        );
    } catch (error) {
        console.log("Register Error:", error);

        await session.abortTransaction();
        session.endSession();

        return createResponse(
            { success: false, message: "Error while registering user" },
            StatusCode.INTERNAL_ERROR
        );
    }
}
