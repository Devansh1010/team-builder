import { dbConnect } from "@/lib/dbConnect";
import { userValidation } from "@/lib/schemas/signUpSchema";
import * as z from 'zod'
import User from "@/models/user_models/user.model";


const usernameValidationSchema = z.object({
    username: userValidation
})


export async function GET(request: Request) {

    await dbConnect()

    try {
        //get the entire url
        const { searchParams } = new URL(request.url)
        //get only username from entire url
        const queryParam = {
            username: searchParams.get('username')
        }

        //zod validation
        const result = usernameValidationSchema.safeParse(queryParam)

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: `usernameError ${usernameError}`
            }, { status: 401 })
        }

        const { username } = result.data
        const normalizedUsername = username.toLowerCase();

        const existingUser = await User.findOne({ username: normalizedUsername })

        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username not available"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "Username Available"
        }, { status: 200 })

    } catch (error) {
        console.log("catch uername-abailable.ts: Error checking username ")
        return Response.json({
            success: false,
            message: "Error checking username availability."
        }, { status: 500 })
    }
}