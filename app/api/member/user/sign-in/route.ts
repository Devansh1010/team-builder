import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/dbConnect';
import User from "@/models/user_models/user.model";

import { createResponse, StatusCode } from '@/lib/createResponce';
import { NextRequest } from 'next/server';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import UserData from '@/models/allUsers.model';
import { ST } from 'next/dist/shared/lib/utils';


export async function POST(req: NextRequest) {

    const { username, password } = await req.json()

    if (!username || !password) {
        return createResponse({
            success: false,
            message: 'Missing Credentials'
        }, StatusCode.BAD_REQUEST)
    }

    const validatedUser = username.trim().toLowerCase()

    await dbConnect()

    console.log(validatedUser)

    const isValidUser = await UserData.findOne({
        $or: [
            { username: validatedUser },
            { email: username }
        ]
    })

    if (!isValidUser) {
        return createResponse({
            success: false,
            message: 'You are not Part of the Team'
        }, StatusCode.UNAUTHORIZED)
    }

    //User is registerd

    const user = await User.findOne({
        $or: [
            { username: validatedUser },
            { email: username }
        ]
    })

    if (!user) {
        return createResponse({
            success: false,
            message: 'Invalid Credentials'
        }, StatusCode.BAD_REQUEST)
    }

    const isValidPassword = bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        return createResponse({
            success: false,
            message: 'Invalid Credentials'
        }, StatusCode.BAD_REQUEST)
    }

    //set cookie
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );


    (await cookies()).set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return createResponse({
        success: true,
        message: "Login Successful",
        data: {
            userId: user._id,
            username: user.username,
            isVerified: user.isVerified
        }
    }, StatusCode.OK);

}