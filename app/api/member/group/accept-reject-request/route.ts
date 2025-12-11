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
        //data validation
        const { searchParams } = new URL(req.url);
        const groupId = searchParams.get("groupId");
        const isAccepted = searchParams.get('isAccept') === "true"
        const requestedUser = searchParams.get('requestedUser')

        await dbConnect()

        console.log(data.id)
        const groupRequest = await Group.findOne(
            { _id: groupId, "requestedUser.userId": requestedUser },
            { "requestedUser.$": 1 }
        )

        const userRequest = await User.findOne(
            {
                _id: requestedUser,
                "requestedGroups.groupId": groupId
            },
            { "requestedGroups.$": 1 }
        );


        if (!groupRequest || !userRequest) {
            return createResponse(
                { success: false, message: "Request Not exist" },
                StatusCode.BAD_REQUEST
            );
        }

        const userGroups = await User.findById(data.id).select('groups')

        console.log(userGroups)

        if (!userGroups?.groups || userGroups.groups.length === 0) {
            return createResponse(
                { success: false, message: "You are not part of any group" },
                StatusCode.BAD_REQUEST
            );
        }


        //check if group is full or not

        const isLeader = userGroups.groups.some(
            (g: any) => g.groupId == groupId && g.userRole === UserRole.LEADER
        );

        if (!isLeader) {
            return createResponse(
                { success: false, message: "Unauthorized" },
                StatusCode.UNAUTHORIZED
            );
        }

        //is leader - true
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (isAccepted) {

                const newUpdatedGroup = await Group.findOneAndUpdate(
                    { _id: groupId, "requestedUser.userId": requestedUser },
                    {
                        $push: {
                            accessTo: {
                                userId: requestedUser,
                                userRole: UserRole.MEMBER,
                                joinedAt: new Date()
                            }
                        },

                        $pull: {
                            requestedUser: { userId: requestedUser }
                        }
                    }, {
                    session, new: true
                }
                );

                await User.findOneAndUpdate(
                    { _id: requestedUser, "requestedGroups.groupId": groupId },

                    {
                        $push: {
                            groups: {
                                groupId: groupId,
                                userRole: UserRole.MEMBER,
                                joinedAt: new Date()
                            }
                        },

                        $pull: {
                            requestedGroups: { groupId: groupId }
                        }
                    }, {
                    session,
                    new: true
                }
                )

                await UserLog.findOneAndUpdate(
                    { userId: requestedUser },
                    {
                        $push: {
                            logs: {
                                groupId: groupId,
                                groupName: newUpdatedGroup.name,
                                msg: "Joined the Group"
                            }
                        }
                    }, {
                    session,
                    new: true
                }
                )

                await GroupLog.findOneAndUpdate(
                    { groupId: groupId },
                    {
                        $push: {
                            logs: {
                                userId: requestedUser,
                                username: data.username,
                                msg: "Joined the Group"
                            }
                        }
                    }, {
                    session,
                    new: true
                }
                )

                await session.commitTransaction();
                await session.endSession();

                return createResponse({
                    success: true,
                    message: "Requested Accepted",

                }, StatusCode.CREATED);
            } else {

                await Group.findOneAndUpdate(
                    { _id: groupId, "requestedUser.userId": requestedUser },
                    {

                        $pull: {
                            requestedUser: { userId: requestedUser }
                        }
                    }, {
                    session, new: true
                }
                );

                await User.findOneAndUpdate(
                    { _id: requestedUser, "requestedGroups.userId": groupId },

                    {

                        $pull: {
                            requestedGroups: { groupId: groupId }
                        }
                    }, {
                    session,
                    new: true
                }
                )

                await session.commitTransaction();
                await session.endSession();

                return createResponse({
                    success: true,
                    message: "Request Rejected"
                }, StatusCode.CREATED);
            }
        } catch (error) {
            await session.abortTransaction()
            await session.endSession()
            return createResponse({
                success: false,
                message: "Error in Request Handaling",
                data: error
            }, StatusCode.UNPROCESSABLE);
        }

    } catch (error) {
        return createResponse({
            success: false,
            message: "Error Occured",
            data: error
        }, StatusCode.INTERNAL_ERROR);
    }
}