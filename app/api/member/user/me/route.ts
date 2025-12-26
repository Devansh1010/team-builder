import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import valkey from '@/lib/valkey'
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

    const userId = data.id

    await dbConnect()

    //try to fetch from catchMemory
    const cachedUser = await valkey.get(`user_profile_${userId}`)

    if (cachedUser) {
      return createResponse(
        {
          success: true,
          message: 'Batches found (cached)',
          data: JSON.parse(cachedUser),
        },
        StatusCode.OK
      )
    }

    const userInfo = await User.findOne({ _id: userId }).select('-password')

    if (!userInfo)
      return createResponse(
        {
          success: false,
          message: 'No User found',
          data: {},
        },
        StatusCode.NOT_FOUND
      )

    await valkey.setEx(`user_profile_${userId}`, 600, JSON.stringify(userInfo))

    return createResponse(
      {
        success: true,
        message: 'User found',
        data: userInfo,
      },
      StatusCode.OK
    )
  } catch (error: any) {
    console.error('Error Finding User:', error)

    return createResponse(
      {
        success: false,
        message: 'Error Finding User',
        error: {
          code: '500',
          message: 'Internal Server Error',
          details: error.message,
        },
      },
      StatusCode.INTERNAL_ERROR
    )
  }
}
