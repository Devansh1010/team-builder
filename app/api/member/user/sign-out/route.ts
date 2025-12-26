import { createResponse, StatusCode } from '@/lib/createResponce'
import { VerifyUser } from '@/lib/verifyUser/userVerification'
import { LogoutUser } from '@/lib/verifyUser/userLogout'

export async function POST() {
    try {
        const auth = await VerifyUser()

        if (!auth.success) {
            return auth.response
        }

        console.log(auth)

        const data = auth.user
        if (!data) {
            return createResponse({ success: false, message: 'Unauthorized' }, StatusCode.UNAUTHORIZED)
        }

        console.log('get hre')

        LogoutUser()

        return createResponse(
            { success: true, message: 'Logged out successfully' },
            StatusCode.OK
        )

    } catch (error: any) {
        console.error('Error Finding User:', error)

        return createResponse(
            {
                success: false,
                message: 'Error Loging Out User',
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
