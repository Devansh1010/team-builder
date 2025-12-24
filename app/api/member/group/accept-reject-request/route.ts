import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import mongoose from 'mongoose'
import User, { UserRole } from '@/models/user_models/user.model'
import Group from '@/models/user_models/group.model'
import GroupLog from '@/models/user_models/group-log.model'
import UserLog from '@/models/user_models/user-log.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const auth = await VerifyUser()
    if (!auth.success) return auth.response

    const user = auth.user
    if (!user) {
      return createResponse({ success: false, message: 'Unauthorized' }, StatusCode.UNAUTHORIZED)
    }

    await dbConnect()

    // 2. Extract request data
    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('groupId')
    const requestedUserId = searchParams.get('requestedUser')
    const isAccept = searchParams.get('isAccept') === 'true'

    if (!groupId || !requestedUserId) {
      return createResponse({ success: false, message: 'Invalid request' }, StatusCode.BAD_REQUEST)
    }

    //check if user created a group or not

    const userCreatedGroup = await User.findById(requestedUserId)

    if (isAccept) {
      if (userCreatedGroup.groups?.length) {
        return createResponse(
          { success: false, message: 'Invalid request' },
          StatusCode.BAD_REQUEST
        )
      }
    }

    // 3. Check if this user is leader of the group
    const currentUserData = await User.findById(user.id).select('groups')

    const isLeader = currentUserData.groups.some(
      (g: { groupId: any; userRole: string }) =>
        g.groupId == groupId && g.userRole === UserRole.LEADER
    )

    if (!isLeader) {
      return createResponse({ success: false, message: 'Unauthorized' }, StatusCode.UNAUTHORIZED)
    }

    // 4. Validate group request existence
    const groupRequest = await Group.findOne(
      { _id: groupId, 'requestedUser.userId': requestedUserId },
      { 'requestedUser.$': 1 }
    )

    const userRequest = await User.findOne(
      { _id: requestedUserId, 'requestedGroups.groupId': groupId },
      { 'requestedGroups.$': 1 }
    )

    if (!groupRequest || !userRequest) {
      return createResponse(
        { success: false, message: 'Request does not exist' },
        StatusCode.BAD_REQUEST
      )
    }

    // 5. Optional group full logic (your placeholder)
    // const group = await Group.findById(groupId).select("members limit");
    // if (group.members.length >= group.limit) {
    //     return createResponse(
    //         { success: false, message: "Group is full" },
    //         StatusCode.BAD_REQUEST
    //     );
    // }

    // 6. Start transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      if (isAccept) {
        // ACCEPT REQUEST
        const updatedGroup = await Group.findOneAndUpdate(
          {
            _id: groupId
          },
          {
            // 1. Remove them if they exist (prevents duplicates)
            // 2. Remove them from requests (completes the join)
            $pull: {
              members: { userId: requestedUserId },
              accessTo: { userId: requestedUserId },
              requestedUser: { userId: requestedUserId }
            }
          },
          { session, new: true }
        );

        // Immediately add them back (The "Proceed" part)
        await Group.updateOne(
          { _id: groupId },
          {
            $push: {
              members: {
                userId: requestedUserId,
                username: userCreatedGroup.username,
                userRole: UserRole.MEMBER,
                joinedAt: new Date(),
              },
              accessTo: {
                userId: requestedUserId,
                username: userCreatedGroup.username,
                userRole: UserRole.MEMBER,
                joinedAt: new Date(),
              }
            }
          },
          { session }
        );

        const updatedUser = await User.findOneAndUpdate(
          { _id: requestedUserId, 'requestedGroups.groupId': groupId },
          {
            $push: {
              groups: {
                groupId,
                userRole: UserRole.MEMBER,
                joinedAt: new Date(),
              },
            },
            $pull: { requestedGroups: { groupId } },
          },
          { session, new: true }
        )

        // User log
        await UserLog.findOneAndUpdate(
          { userId: requestedUserId },
          {
            $push: {
              logs: {
                groupId,
                groupName: updatedGroup.name,
                msg: 'Joined the group',
              },
            },
          },
          {
            session,
            new: true,
            upsert: true, // creates doc if not found
            setDefaultsOnInsert: true, // ensures schema defaults apply
          }
        )

        // Group log
        await GroupLog.findOneAndUpdate(
          { groupId },
          {
            $push: {
              logs: {
                userId: requestedUserId,
                username: updatedUser.username,
                msg: 'Joined the group',
              },
            },
          },
          { session }
        )

        await session.commitTransaction()
        session.endSession()

        return createResponse({ success: true, message: 'Request Accepted' }, StatusCode.CREATED)
      }

      // REJECT REQUEST

      await Group.findOneAndUpdate(
        { _id: groupId, 'requestedUser.userId': requestedUserId },
        { $pull: { requestedUser: { userId: requestedUserId } } },
        { session }
      )

      await User.findOneAndUpdate(
        { _id: requestedUserId, 'requestedGroups.groupId': groupId },
        { $pull: { requestedGroups: { groupId } } },
        { session }
      )

      await session.commitTransaction()
      session.endSession()

      return createResponse({ success: true, message: 'Request Rejected' }, StatusCode.CREATED)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()

      return createResponse(
        {
          success: false,
          message: 'Error handling request',
          data: error,
        },
        StatusCode.UNPROCESSABLE
      )
    }
  } catch (err) {
    return createResponse(
      {
        success: false,
        message: 'Internal server error',
        data: err,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
