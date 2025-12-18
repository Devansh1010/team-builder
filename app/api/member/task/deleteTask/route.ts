import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import Group from '@/models/user_models/group.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import { createTaskSchema } from '@/lib/schemas/task/createTask'
import Task from '@/models/user_models/task.model'

export async function PATCH(req: NextRequest) {
  try {
    const auth = await VerifyUser()
    if (!auth.success) return auth.response

    const user = auth.user
    if (!user) {
      return createResponse({ success: false, message: 'Unauthorized' }, StatusCode.UNAUTHORIZED)
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get('taskId')
    const groupId = searchParams.get('groupId')

    if (
      !taskId ||
      !groupId ||
      !taskId.match(/^[0-9a-fA-F]{24}$/) ||
      !groupId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return createResponse(
        { success: false, message: 'Invalid taskId or groupId' },
        StatusCode.BAD_REQUEST
      )
    }

    // Ensure user is group member
    const isMember = await Group.exists({
      _id: groupId,
      'members.userId': user.id,
    })

    if (!isMember) {
      return createResponse({ success: false, message: 'Not a group member' }, StatusCode.FORBIDDEN)
    }

    // Ensure task belongs to group
    const task = await Task.findOne({
      _id: taskId,
      groupId,
    })

    if (!task) {
      return createResponse({ success: false, message: 'Task not found' }, StatusCode.NOT_FOUND)
    }

    if (task.createdBy.userId.toString() !== user.id) {
      return createResponse(
        { success: false, message: 'Only Creator of Task can Delete the Task' },
        StatusCode.BAD_REQUEST
      )
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      groupId,
    })

    return createResponse(
      {
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask,
      },
      StatusCode.OK
    )
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Error deleting task',
        error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
