import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import Group from '@/models/user_models/group.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import User from '@/models/user_models/user.model'

export async function GET(req: NextRequest) {
  try {
    const auth = await VerifyUser()

    if (!auth.success) {
      return auth.response
    }

    const data = auth.user

    if (!data) {
      return createResponse({ success: false, message: 'Unauthorized' }, StatusCode.UNAUTHORIZED)
    }

    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('groupId')

    await dbConnect()

    if (groupId) {
      const group = await Group.findById(groupId)

      if (!group) {
        return createResponse(
          { success: false, message: 'Unable to Get the Group data' },
          StatusCode.CONFLICT
        )
      }

      // ! chekc if user already applied to this group if yes also send isApplied: true in data

      return createResponse(
        {
          success: true,
          message: 'Found the Group data',
          data: [group],
        },
        StatusCode.OK
      )
    } else {
      const user = await User.findById(data.id).select('groups')

      const userGroups = user?.groups || []

      if (userGroups.length === 0) {
        return createResponse(
          { success: false, message: 'Not part of any Group' },
          StatusCode.NOT_FOUND
        )
      }

      // extract groupIds
      const groupIds = userGroups.map((g: any) => g.groupId)

      // fetch all matching groups
      const allGroups = await Group.find({
        _id: { $in: groupIds },
      })

      console.log(allGroups)

      return createResponse(
        {
          success: true,
          message: 'Found Group For User',
          data: allGroups,
        },
        StatusCode.OK
      )
    }
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Error While Fetching Group',
        data: error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
