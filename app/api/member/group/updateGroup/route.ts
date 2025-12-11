import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import Group from "@/models/user_models/group.model";
import { VerifyUser } from "@/lib/verifyUser/userVerification";
import User, { UserRole } from "@/models/user_models/user.model";
import mongoose from "mongoose";
import GroupLog from "@/models/user_models/group-log.model";

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

        const { searchParams } = new URL(req.url);
        const groupId = searchParams.get("groupId");

        await dbConnect()

        const groupUsers = await Group.findById(groupId).select('accessTo')

        console.log('Access To:-', groupUsers)

        if (!groupUsers || groupUsers.length === 0) {
            return createResponse(
                { success: false, message: "You are not part of group" },
                StatusCode.BAD_REQUEST
            );
        }

        const isLeader = groupUsers.some(
            (g: { userId: any, userRole: string }) => g.userId == data.id && g.userRole === UserRole.LEADER
        );

        if (!isLeader) {
            return createResponse(
                { success: false, message: "Unauthorized" },
                StatusCode.UNAUTHORIZED
            );
        }

        //Fetching Data and Validate it
        const body = await req.json()
        const errors: string[] = [];
        const name = body.name?.trim().toLowerCase();
        if (!name || name.length < 2) {
            errors.push("Name must be at least 2 characters.");
        }
        const desc = body.desc

        const techStack = body.techStack

        const imageUrl = body.imageUrl


        if (errors.length > 0) {
            return createResponse({

                success: false,
                message: "Validation failed",
                data: errors
            }, StatusCode.BAD_REQUEST);
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const updatedGroup = await Group.findByIdAndUpdate(groupId,
                {
                    name,
                    desc,
                    techStack,
                    imageUrl
                },
                {
                    session,
                    new: true
                }
            )

            await GroupLog.findOneAndUpdate(
                { groupId },
                {
                    $push: {
                        logs: {
                            userId: data.id,
                            username: data.username,
                            msg: "Updated Group Information"
                        }
                    }
                }, {
                session,
                new: true
            }
            )

            //Updated Successfully
            await session.commitTransaction();
            await session.endSession();

            return createResponse({
                success: true,
                message: "Group Updated Successfully",
                data: updatedGroup

            }, StatusCode.CREATED);

        } catch (error) {

            await session.abortTransaction()
            await session.endSession()
            return createResponse({
                success: false,
                message: "Error Updating Group",
                data: error
            }, StatusCode.UNPROCESSABLE);
        }

    } catch (error) {
        return createResponse({
            success: false,
            message: "Error Updating Group",
            data: error
        }, StatusCode.INTERNAL_ERROR);
    }
}