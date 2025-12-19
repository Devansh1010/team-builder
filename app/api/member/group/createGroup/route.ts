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
    const auth = await VerifyUser()

    if (!auth.success) {
      return auth.response
    }

    const data = auth.user
    if (!data) {
      return createResponse({ success: false, message: 'Unauthorized' }, StatusCode.UNAUTHORIZED)
    }

    await dbConnect()

    const userGroups = await User.findById(data.id).select('groups requestedGroups')

    if (userGroups?.groups?.length > 0) {
      return createResponse(
        { success: false, message: 'You are already part of a group' },
        StatusCode.BAD_REQUEST
      )
    }

    const appliedGroups = userGroups.requestedGroups.map((id: { groupId: string }) =>
      id.groupId.toString()
    )

    const body = await req.json()

    const errors: string[] = []

    const name = body.name?.trim().toLowerCase()
    if (!name || name.length < 2) {
      errors.push('Name must be at least 2 characters.')
    }

    const desc = body.desc

    const techStack = body.techStack

    const imageUrl = body.imageUrl

    if (errors.length > 0) {
      return createResponse(
        {
          success: false,
          message: 'Validation failed',
          data: errors,
        },
        StatusCode.BAD_REQUEST
      )
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      let group
      group = await Group.create(
        [
          {
            name,
            desc,
            techStack,
            imageUrl,
            accessTo: [
              {
                userId: data.id,
                userRole: UserRole.LEADER,
                username: data.username,
                joinedAt: new Date(),
              },
            ],
            members: [
              {
                userId: data.id,
                userRole: UserRole.LEADER,
                username: data.username,
                joinedAt: new Date(),
                leftAt: null,
              },
            ],
          },
        ],
        { session }
      )

      group = group[0]

      //Remove all the requests form other groups

      if (appliedGroups.length > 0) {
        for (const groupId of appliedGroups) {
          const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            {
              $pull: {
                requestedUser: { userId: data.id },
              },
            },
            { session }
          )
        }

        await User.findByIdAndUpdate(
          data.id,
          {
            $set: {
              requestedGroups: [],
            },
          },
          { session, new: true }
        )
      }

      await GroupLog.create(
        [
          {
            groupId: group._id,
            logs: [
              {
                userId: data.id,
                username: data.username,
                msg: 'Group Created',
              },
            ],
          },
        ],
        { session }
      )

      const userLog = await UserLog.findOne({ userId: data.id }).session(session)

      if (!userLog) {
        // Create new user log document
        await UserLog.create(
          [
            {
              userId: data.id,
              logs: [
                {
                  groupId: group._id,
                  groupName: group.name,
                  isCreated: true,
                  msg: 'Group Created',
                },
              ],
            },
          ],
          { session }
        )
      } else {
        // Push new log entry into existing user's logs
        await UserLog.updateOne(
          { userId: data.id },
          {
            $push: {
              logs: {
                groupId: group._id,
                groupName: group.name,
                isCreated: true,
                msg: 'Group Created',
              },
            },
          },
          { session }
        )
      }

      await User.findOneAndUpdate(
        { _id: data.id },
        {
          $push: {
            groups: {
              groupId: group._id,
              userRole: UserRole.LEADER,
              joinedAt: new Date(),
            },
          },
        },
        { session }
      )

      console.log('userLog-Log Created')
      await session.commitTransaction()
      await session.endSession()

      return createResponse(
        {
          success: true,
          message: 'Group created successfully',
          data: group,
        },
        StatusCode.CREATED
      )
    } catch (error) {
      await session.abortTransaction()
      await session.endSession()
      return createResponse(
        {
          success: false,
          message: 'Error Creating Group',
          data: error,
        },
        StatusCode.UNPROCESSABLE
      )
    }
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Error Creating Group',
        data: error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
