import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import User, { UserRole } from "@/models/user_models/user.model";

import Group from "@/models/user_models/group.model";
import GroupLog from "@/models/user_models/group-log.model";
import UserLog from "@/models/user_models/user-log.model";
import { VerifyUser } from "@/lib/verifyUser/userVerification";


export async function POST(req: NextRequest) {
    try {

        const auth = await VerifyUser();

        if (!auth.success) {
            return auth.response;
        }

        const data = auth.user;

        if (!data) {
            return createResponse(
                { success: false, message: "Unauthorized" },
                StatusCode.UNAUTHORIZED
            );
        }

        await dbConnect()
        
        const userGroups = await User.findById(data.id).select("groups");

        if (userGroups?.groups?.length > 0) {
            return createResponse(
                { success: false, message: "You are already part of a group" },
                StatusCode.BAD_REQUEST
            );
        }

        const { groupId, msg } = await req.json()

        if (!groupId) {
            return createResponse(
                { success: false, message: "Invalid GroupId" },
                StatusCode.BAD_REQUEST
            );
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {

            await Group.findByIdAndUpdate(
                groupId,
                {
                    $push: {
                        requestedUser: {
                            userId: data.id,
                            msg
                        }
                    }
                },
                { session }
            );



            await User.findByIdAndUpdate(data.id,
                {
                    $push: {
                        requestedGroups: groupId
                    }

                },
                { session }
            )

            // ! if want to store logs for requests also:-
            // await GroupLog.findOneAndUpdate(
            //     { groupId },
            //     {
            //         $push: {
            //             logs: {
            //                 userId: data.id,
            //                 username: data.username,
            //                 msg: "Requested to join group"
            //             }
            //         }
            //     },
            //     { session }
            // )
            // const group = await Group.findById(groupId)

            // await UserLog.findOneAndUpdate(
            //     { userId: data.id },
            //     {
            //         $push: {
            //             logs: {
            //                 groupId,
            //                 groupName: group.name,
            //                 msg: "Requested to join group"
            //             }
            //         }
            //     },
            //     { session }
            // )

            await session.commitTransaction();
            await session.endSession();

            // ? send email to leader 

            return createResponse({
                success: true,
                message: "Group Join request sent",
            }, StatusCode.CREATED);

        } catch (error) {
            await session.abortTransaction()
            await session.endSession()
            return createResponse({
                success: false,
                message: "Error Sending Group Request",
                data: error
            }, StatusCode.UNPROCESSABLE);
        }
    } catch (error) {
        return createResponse({
            success: false,
            message: "Error Sending Group Request",
            data: error
        }, StatusCode.INTERNAL_ERROR);
    }
}