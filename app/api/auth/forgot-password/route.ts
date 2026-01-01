import { dbConnect } from '@/lib/dbConnect'
import Admin from '@/models/admin.model'
import { createResponse, StatusCode } from '@/lib/createResponce'
import { NextRequest } from 'next/server'
import { sendForgotPassword } from '@/helpers/forgotPasswordEmail'
import crypto from 'crypto';
import valkey from '@/lib/valkey'

export async function POST(req: NextRequest) {
    try {

        const { email } = await req.json();
        console.log(email)

        // 1. Validation: Check if email exists in request
        if (!email) {
            return createResponse(
                { success: false, message: "Email is required" },
                StatusCode.BAD_REQUEST
            );
        }

        // 2. Database Connection
        await dbConnect();
        const isAdminExist = await Admin.findOne({ email });

        // 3. Security: Prevent email enumeration

        if (!isAdminExist) {
            return createResponse(
                {
                    success: true,
                    message: "If this email is registered, a reset link has been sent."
                },
                StatusCode.OK
            );
        }

        // 4. Generate Secure Token
        const token = crypto.randomBytes(32).toString('hex');

        // 5. Store in Valkey (TTL: 10 min)

        await valkey.setEx(`reset_token:${token}`, 600, isAdminExist.email);

        // 6. Send Email with Token and Username
        const emailResponse = await sendForgotPassword(
            isAdminExist.email,
            token,
            isAdminExist.username
        );

        return createResponse(
            {
                success: true,
                message: emailResponse.message || "Reset email sent successfully",
            },
            StatusCode.OK
        );

    } catch (error: any) {
        console.error("FORGOT_PASSWORD_ERROR:", error);
        return createResponse(
            { success: false, message: "Internal Server Error" },
            StatusCode.INTERNAL_ERROR
        );
    }
}
