import { resend } from '@/lib/resend'
import ForgotPasswordEmail from '@/emails/forgotPasswordEmail'

export async function sendForgotPassword(email: string, resetLink: string, username: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Forgot Password || TeamUp',
            react: ForgotPasswordEmail({ username, resetLink }),
        })

        return {
            success: true,
            message: 'Email sent successfully',
        }
    } catch (emailError) {
        console.log('Error sending Email', emailError)
        return {
            success: false,
            message: 'Error Sending Email',
        }
    }
}
