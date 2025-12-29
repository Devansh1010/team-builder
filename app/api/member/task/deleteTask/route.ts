import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import Group from '@/models/user_models/group.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import Task from '@/models/user_models/task.model'

export async function DELETE(req: NextRequest) {
  try {
    const auth = await VerifyUser()
    if (!auth.success) return auth.response

    const user = auth.user
    if (!user) {
      return createResponse({ success: false, message: 'Unauthorized' }, StatusCode.UNAUTHORIZED)
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('groupId')
    
    // Expecting an array of IDs: { taskIds: ["id1", "id2"] }
    const { taskIds } = await req.json()

    // 1. Validation: Ensure groupId exists and taskIds is a non-empty array
    if (!groupId || !Array.isArray(taskIds) || taskIds.length === 0) {
      return createResponse(
        { success: false, message: 'Invalid groupId or no taskIds provided' },
        StatusCode.BAD_REQUEST
      )
    }

    // 2. Ensure user is a member of the group
    // Note: Per your constraint, this group likely only has 1 member entry.
    const isMember = await Group.exists({
      _id: groupId,
      'accessTo.userId': user.id,
    })

    if (!isMember) {
      return createResponse({ success: false, message: 'Not a group member' }, StatusCode.FORBIDDEN)
    }

    // 3. Delete Operation:
    // Only delete tasks that:
    // - Are in the provided ID list
    // - Belong to this specific groupId
    // - Were created by this specific user (Owner check)
    const deleteResult = await Task.deleteMany({
      _id: { $in: taskIds },
      groupId: groupId,
      'createdBy.userId': user.id 
    })

    if (deleteResult.deletedCount === 0) {
      return createResponse(
        { success: false, message: 'No tasks found to delete or unauthorized' },
        StatusCode.NOT_FOUND
      )
    }

    return createResponse(
      {
        success: true,
        message: `${deleteResult.deletedCount} tasks deleted successfully`,
        data: deleteResult,
      },
      StatusCode.OK
    )
  } catch (error) {
    return createResponse(
      { success: false, message: 'Error deleting tasks', error },
      StatusCode.INTERNAL_ERROR
    )
  }
}