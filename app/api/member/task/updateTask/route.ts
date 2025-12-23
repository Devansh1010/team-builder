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
    // const groupId = searchParams.get('groupId')

    if (
      !taskId ||
      !mongoose.Types.ObjectId.isValid(taskId)
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

    // const isMember = await Group.exists({
    //   _id: groupId,
    //   'members.userId': user.id,
    // })

    // if (!isMember) {
    //   return createResponse({ success: false, message: 'Not a group member' }, StatusCode.FORBIDDEN)
    // }

    const task = await Task.findOne({
      _id: taskId,
      // groupId,
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
        const { UPDATE_STATUS } = payload || {}

        const status = UPDATE_STATUS.status
        if (!status) return badRequest('Status required')

        updateQuery.$set = { status }
        break
      }

      case 'UPDATE_PRIORITY': {
        const { UPDATE_PRIORITY } = payload || {}
        const priority = UPDATE_PRIORITY.priority
        if (!priority) return badRequest('Priority required')

        updateQuery.$set = { priority }
        break
      }

      case 'UPDATE_DUE_DATE': {
        const { UPDATE_DUE_DATE } = payload || {}
        const dueDate = UPDATE_DUE_DATE.dueDate
        if (!dueDate) return badRequest('Due date required')
        if (new Date(dueDate) <= new Date()) {
          return badRequest('Due date must be in future')
        }

        updateQuery.$set = { dueDate }
        break
      }

      case 'ADD_ASSIGNEE': {
        const { ADD_ASSIGNEE } = payload || {}
        const assignee = ADD_ASSIGNEE.assignee
        if (!assignee) return badRequest('userId required')

        // validate user is in group
        // const isValidUser = await Group.exists({
        //   _id: groupId,
        //   'accessTo.userId': userId,
        // })

        // if (!isValidUser) return badRequest('Invalid assignee')

        updateQuery.$addToSet = {
          assignedTo: {
            assignee,
            assignedAt: new Date(),
          },
        }
        break
      }

      case 'REMOVE_ASSIGNEE': {
        const { REMOVE_ASSIGNEE } = payload || {}
        const assignee = REMOVE_ASSIGNEE.assignee
        if (!assignee) return badRequest('userId required')

        updateQuery.$pull = {
          assignedTo: { assignee },
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
