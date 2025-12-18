import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import Group from '@/models/user_models/group.model'
import Task from '@/models/user_models/task.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import mongoose from 'mongoose'

type TaskOperation =
  | 'UPDATE_DETAILS'
  | 'UPDATE_STATUS'
  | 'UPDATE_PRIORITY'
  | 'UPDATE_DUE_DATE'
  | 'ADD_ASSIGNEE'
  | 'REMOVE_ASSIGNEE'

export async function PATCH(req: NextRequest) {
  try {
    const auth = await VerifyUser()
    if (!auth.success) return auth.response
    const user = auth.user!

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get('taskId')
    const groupId = searchParams.get('groupId')

    if (
      !taskId ||
      !groupId ||
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(groupId)
    ) {
      return createResponse(
        { success: false, message: 'Invalid taskId or groupId' },
        StatusCode.BAD_REQUEST
      )
    }

    const { operation, payload } = await req.json()

    if (!operation) {
      return createResponse(
        { success: false, message: 'Operation required' },
        StatusCode.BAD_REQUEST
      )
    }

    const isMember = await Group.exists({
      _id: groupId,
      'members.userId': user.id,
    })

    if (!isMember) {
      return createResponse({ success: false, message: 'Not a group member' }, StatusCode.FORBIDDEN)
    }

    const task = await Task.findOne({
      _id: taskId,
      groupId,
    })

    if (!task) {
      return createResponse({ success: false, message: 'Task not found' }, StatusCode.NOT_FOUND)
    }

    let updateQuery: any = {}

    switch (operation as TaskOperation) {
      case 'UPDATE_DETAILS': {
        const { title, description } = payload || {}

        if (!title && !description) {
          return badRequest('Nothing to update')
        }

        updateQuery.$set = {
          ...(title && { title }),
          ...(description && { description }),
        }
        break
      }

      case 'UPDATE_STATUS': {
        const { status } = payload || {}

        if (!status) return badRequest('Status required')

        updateQuery.$set = { status }
        break
      }

      case 'UPDATE_PRIORITY': {
        const { priority } = payload || {}

        if (!priority) return badRequest('Priority required')

        updateQuery.$set = { priority }
        break
      }

      case 'UPDATE_DUE_DATE': {
        const { dueDate } = payload || {}

        if (!dueDate) return badRequest('Due date required')
        if (new Date(dueDate) <= new Date()) {
          return badRequest('Due date must be in future')
        }

        updateQuery.$set = { dueDate }
        break
      }

      case 'ADD_ASSIGNEE': {
        const { userId } = payload || {}

        if (!userId) return badRequest('userId required')

        // validate user is in group
        const isValidUser = await Group.exists({
          _id: groupId,
          'accessTo.userId': userId,
        })

        if (!isValidUser) return badRequest('Invalid assignee')

        updateQuery.$addToSet = {
          assignedTo: {
            userId,
            assignedAt: new Date(),
          },
        }
        break
      }

      case 'REMOVE_ASSIGNEE': {
        const { userId } = payload || {}

        if (!userId) return badRequest('userId required')

        updateQuery.$pull = {
          assignedTo: { userId },
        }
        break
      }

      default:
        return badRequest('Invalid operation')
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateQuery, { new: true })

    return createResponse(
      {
        success: true,
        message: 'Task updated successfully',
        data: updatedTask,
      },
      StatusCode.OK
    )
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Error updating task',
        error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}

function badRequest(message: string) {
  return createResponse({ success: false, message }, StatusCode.BAD_REQUEST)
}
