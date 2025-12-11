import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import User, { UserRole } from "@/models/user_models/user.model";
import Group from "@/models/user_models/group.model";
import { VerifyUser } from "@/lib/verifyUser/userVerification";
import UserLog from "@/models/user_models/user-log.model";
import GroupLog from "@/models/user_models/group-log.model";

export async function POST(req: NextRequest) {
    try {

        // 1. Authenticate User

        const auth = await VerifyUser();
        if (!auth.success) return auth.response;

        const user = auth.user;
        if (!user) {
            return createResponse(
                { success: false, message: "Unauthorized" },
                StatusCode.UNAUTHORIZED
            );
        }

        await dbConnect();

        // 2. Get user groups in one query

        const userDoc = await User.findById(user.id).select("groups username");
        if (!userDoc?.groups?.length) {
            return createResponse(
                { success: false, message: "You are not part of any group" },
                StatusCode.BAD_REQUEST
            );
        }


        // 3. Extract request data

        const { searchParams } = new URL(req.url);
        const groupId = searchParams.get("groupId");
        const userId = searchParams.get("userId");
        const { msg } = await req.json();

        if (!groupId || !userId) {
            return createResponse(
                { success: false, message: "Invalid Ids" },
                StatusCode.BAD_REQUEST
            );
        }

        if (userId === user.id) {
            return createResponse(
                { success: false, message: "Operation Not allowed" },
                StatusCode.BAD_REQUEST
            );
        }

        // 4. Check if user is leader of this specific group

        const isLeader = userDoc.groups.some(
            (g: { groupId: any; userRole: string }) =>
                g.groupId == groupId && g.userRole === UserRole.LEADER
        );

        if (!isLeader) {
            return createResponse(
                { success: false, message: "Only Leader can Remove the User" },
                StatusCode.BAD_REQUEST
            );
        }
        // ---------------------------
        // 6. Transaction starts
        // ---------------------------
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Remove user from accessTo array
            const updatedGroup = await Group.findByIdAndUpdate(
                groupId,
                {
                    $pull: { accessTo: { userId: userId } }
                },
                { session, new: true }
            );

            // Mark leftAt time for member
            await Group.findOneAndUpdate(
                { _id: groupId, "members.userId": userId },
                { $set: { "members.$.leftAt": Date.now() } },
                { session }
            );

            // Remove group ref from user
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: { groups: { groupId } } },
                { session }
            );

            // User log entry
            await UserLog.findOneAndUpdate(
                { userId: userId },
                {
                    $push: {
                        logs: {
                            groupId,
                            groupName: updatedGroup?.name,
                            isRemoved: true,
                            msg,
                        },
                    },
                },
                {
                    session,
                    new: true,
                    upsert: true, // creates doc if not found
                    setDefaultsOnInsert: true, // ensures schema defaults apply
                }
            );

            // Group log entry
            await GroupLog.findOneAndUpdate(
                { groupId },
                {
                    $push: {
                        logs: {
                            userId: userId,
                            username: updatedUser?.username,
                            isRemoved: true,
                            msg,
                        },
                    },
                },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return createResponse(
                { success: true, message: "Removed User successfully" },
                StatusCode.CREATED
            );

        } catch (err) {
            await session.abortTransaction();
            session.endSession();

            return createResponse(
                {
                    success: false,
                    message: "Error while Removing User from Group",
                    data: err,
                },
                StatusCode.UNPROCESSABLE
            );
        }
    } catch (error) {
        return createResponse(
            {
                success: false,
                message: "Internal Error while Removing User from Group",
                data: error,
            },
            StatusCode.UNPROCESSABLE
        );
    }
}
