import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import Set from "@/models/batch.model";
import { NextRequest } from "next/server";
import { auth } from "@/auth"
import valkey from '@/lib/valkey'
import Admin from "@/models/admin.model";

export async function GET(req: NextRequest) {
    try {

        const session = await auth()

        if (!session || !session?.user) return createResponse({
            success: false,
            message: "User Not Allowed"
        }, StatusCode.UNAUTHORIZED)

        const userId = session.user?.id

        await dbConnect()

        //try to fetch from catchMemory
        const cachedUser = await valkey.get(`user_profile_${userId}`);

        if (cachedUser) {
            return createResponse({
                success: true,
                message: "Batches found (cached)",
                data: JSON.parse(cachedUser),
            }, StatusCode.OK);
        }

        const userInfo = await Admin.findOne({ _id: userId }).select("-password");


        if (!userInfo) return createResponse({
            success: false,
            message: "No Batches found",
            data: {}
        }, StatusCode.NOT_FOUND)


        await valkey.setEx(`user_profile_${userId}`, 600, JSON.stringify(userInfo));

        return createResponse({
            success: true,
            message: "Batches found",
            data: userInfo
        }, StatusCode.OK)


    } catch (error: any) {
        console.error("Error creating batch:", error);

        return createResponse(
            {
                success: false,
                message: "Error Creating Batch",
                error: {
                    code: "500",
                    message: "Internal Server Error",
                    details: error.message,
                },
            },
            StatusCode.INTERNAL_ERROR
        );
    }
}