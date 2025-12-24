import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import GroupLog from '@/models/user_models/group-log.model'
import UserLog from '@/models/user_models/user-log.model'

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

        await dbConnect()

        if (data.id) {
            const userLogs = await UserLog.findOne({ userId: data.id })

            if (!userLogs) {
                return createResponse(
                    { success: false, message: 'Unable to Get the User Logs' },
                    StatusCode.CONFLICT
                )
            }

            return createResponse(
                {
                    success: true,
                    message: 'Found the Group data',
                    data: userLogs,
                },
                StatusCode.OK
            )
        } else {
            return createResponse(
                {
                    success: true,
                    message: 'Invalid User',
                },
                StatusCode.BAD_REQUEST
            )
        }

    } catch (error) {
        return createResponse(
            {
                success: false,
                message: 'Error While Fetching User Logs',
                data: error,
            },
            StatusCode.INTERNAL_ERROR
        )
    }
}
