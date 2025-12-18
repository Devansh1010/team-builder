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
    const taskId = searchParams.get('taskId')
    const groupId = searchParams.get('groupId')

    await dbConnect()

    const isMember = await Group.exists({
      _id: groupId,
      'accessTo.userId': data.id,
    })

    if (!isMember) {
      return createResponse({ success: false, message: 'Not a group member' }, StatusCode.FORBIDDEN)
    }

    const groupTask = await Task.findById(taskId)

    if (!taskId) {
      return createResponse(
        {
          success: false,
          message: 'Task not found',
        },
        StatusCode.NOT_FOUND
      )
    }

    return createResponse(
      {
        success: false,
        message: 'Error While Fetching Group',
        data: groupTask,
      },
      StatusCode.INTERNAL_ERROR
    )
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
