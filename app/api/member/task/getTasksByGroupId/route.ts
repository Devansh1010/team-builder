import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import Group from '@/models/user_models/group.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import Task from '@/models/user_models/task.model'

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

    const isMember = await Group.exists({
      _id: groupId,
      'accessTo.userId': data.id,
    })

    if (!isMember) {
      return createResponse({ success: false, message: 'Not a group member' }, StatusCode.FORBIDDEN)
    }

    const groupTasks = await Task.find({
      groupId,
    })

    if (groupTasks.length === 0) {
      return createResponse(
        {
          success: false,
          message: 'No Tasks For this Group',
          data: []
        },
        StatusCode.NOT_FOUND
      )
    }

    return createResponse(
      {
        success: true,
        message: 'Tasks Found',
        data: groupTasks || [],
      },
      StatusCode.OK
    )
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Error While Fetching Tasks',
        data: error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
