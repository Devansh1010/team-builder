import User from "@/models/user_models/user.model";
import { z } from "zod"
import { verifySchema } from "@/lib/schemas/verifySchema"
import { dbConnect } from "@/lib/dbConnect";
import { createResponse, StatusCode } from "@/lib/createResponce";

const verifyQuerySchema = z.object({
    code: verifySchema
})

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, verifyCode } = await request.json()

        const normalizedUsername = username.toLowerCase()
        const user = await User.findOne({ username: normalizedUsername })

        if (!user) {
            return createResponse({
                success: false,
                message: "Username is not found"
            }, StatusCode.INTERNAL_ERROR)
        }


        const isCodeValid = user.verifyCode === verifyCode;
        console.log(isCodeValid)

        const isExpriyValid = new Date(user.verifyExpiry) > new Date();

        console.log(isExpriyValid)

        if (!isCodeValid) {
            return createResponse({
                success: false,
                message: "Code is not Valid"
            }, StatusCode.INTERNAL_ERROR)
        }

        if (!isExpriyValid) {
            return createResponse({
                success: false,
                message: "Code is Expired please request for new Code"
            }, StatusCode.INTERNAL_ERROR)
        }

        user.isVerified = true;
        user.verifyCode = undefined;
        user.verifyExpiry = undefined;

        await user.save()

        return createResponse({
            success: true,
            message: "User Verified Successfully"
        }, StatusCode.OK)

    } catch (error) {
        console.error("Error Checking verify Code", error)
        return createResponse({
            success: false,
            message: "Error Checking verify Code"
        }, StatusCode.INTERNAL_ERROR)
    }
}
