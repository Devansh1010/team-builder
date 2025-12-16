import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import Group from '@/models/user_models/group.model'
import { VerifyUser } from '@/lib/verifyUser/userVerification'

export async function GET() {
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

    const allGroups = await Group.find({})

    if (allGroups.length === 0) {
      return createResponse({ success: false, message: 'No Groups Found' }, StatusCode.NOT_FOUND)
    }

    const filterdGroups = allGroups.filter((group) => group.accessTo.length > 0)

    return createResponse(
      {
        success: true,
        message: 'Found Some Groups',
        data: filterdGroups,
      },
      StatusCode.OK
    )
  } catch (error) {
    return createResponse(
      {
        success: false,
        message: 'Error While Finding Groups',
        data: error,
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
