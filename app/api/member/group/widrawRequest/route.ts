import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import mongoose from 'mongoose'
import User from '@/models/user_models/user.model'
import Group from '@/models/user_models/group.model'
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

    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('groupId')

    if (!groupId) {
      return createResponse({ success: false, message: 'Invalid GroupId' }, StatusCode.BAD_REQUEST)
    }

    const groupRequest = await Group.findOne(
      { _id: groupId, 'requestedUser.userId': data.id },
      { 'requestedUser.$': 1 }
    )

    const userRequest = await User.findOne(
      { _id: data.id, 'requestedGroups.groupId': groupId },
      { 'requestedGroups.$': 1 }
    )

    if (!groupRequest || !userRequest) {
      return createResponse(
        { success: false, message: 'No Requesst Found' },
        StatusCode.BAD_REQUEST
      )
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: {
            requestedUser: {
              userId: data.id,
            },
          },
        },
        { session, new: true }
      )

      await User.findByIdAndUpdate(
        data.id,
        {
          $pull: {
            requestedGroups: {
              groupId,
            },
          },
        },
        { session, new: true }
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

      await session.commitTransaction()
      await session.endSession()

      // ? send email to leader

      return createResponse(
        {
          success: true,
          message: 'Widraw Join request',
        },
        StatusCode.CREATED
      )
    } catch (error) {
      await session.abortTransaction()
      await session.endSession()
      return createResponse(
        {
          success: false,
          message: 'Error widrawing Group Request',
          data: error,
        },
        StatusCode.UNPROCESSABLE
      )
    }
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Internal Error Occured While Widrawing Request',
        data: error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
