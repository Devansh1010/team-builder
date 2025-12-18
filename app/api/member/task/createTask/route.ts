import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import Group from '@/models/user_models/group.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import { createTaskSchema } from '@/lib/schemas/task/createTask'
import Task from '@/models/user_models/task.model'

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

    const body = await req.json()

    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('groupId')

    const parsed = createTaskSchema.safeParse(body)

    if (!parsed.success) {
      return createResponse(
        {
          success: false,
          message: 'Validation failed',
        },
        StatusCode.BAD_REQUEST
      )
    }

    const { title, description, status, priority, assignedTo, dueDate } = parsed.data

    if (assignedTo) {
      const ids = assignedTo.map((u) => u.userId)
      const uniqueIds = new Set(ids)

      if (ids.length !== uniqueIds.size) {
        return createResponse(
          {
            success: false,
            message: 'Duplicate assignees are not allowed',
          },
          StatusCode.BAD_REQUEST
        )
      }
    }

    // dueDate must be in future
    if (dueDate && new Date(dueDate) <= new Date()) {
      return createResponse(
        {
          success: false,
          message: 'Due date must be in the future',
        },
        StatusCode.BAD_REQUEST
      )
    }

    await dbConnect()

    const isMember = await Group.exists({
      _id: groupId,
      'accessTo.userId': data.id,
    })

    if (!isMember) {
      return createResponse({ success: false, message: 'Not a group member' }, StatusCode.FORBIDDEN)
    }

    const task = await Task.create({
      title,
      description,
      groupId,
      status,
      priority,
      assignedTo,
      dueDate,
      createdBy: {
        userId: data.id,
        username: data.username,
      },
    })

    return createResponse(
      {
        success: true,
        message: 'Task created Successfully',
        data: task,
      },
      StatusCode.OK
    )
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Error While Creating Task',
        error: error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
