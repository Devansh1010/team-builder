import { createResponse, StatusCode } from '@/lib/createResponce'
import { dbConnect } from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import GroupLog from '@/models/user_models/group-log.model'

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

        if (groupId) {
            const groupLogs = await GroupLog.findOne({ groupId })

            if (!groupLogs) {
                return createResponse(
                    { success: false, message: 'Unable to Get the Group Logs' },
                    StatusCode.CONFLICT
                )
            }

            return createResponse(
                {
                    success: true,
                    message: 'Found the Group Log data',
                    data: groupLogs,
                },
                StatusCode.OK
            )
        } else {
            return createResponse(
                {
                    success: true,
                    message: 'Invalid GroupId',
                },
                StatusCode.BAD_REQUEST
            )
        }

    } catch (error) {
        return createResponse(
            {
                success: false,
                message: 'Error While Fetching Group Logs',
                data: error,
            },
            StatusCode.INTERNAL_ERROR
        )
    }
}
