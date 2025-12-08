import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import Set from "@/models/users.model";
import { NextRequest } from "next/server";
import { auth } from "@/auth"
import valkey from "@/lib/valkey";

export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session || !session?.user) return createResponse({
            success: false,
            message: "User Not Allowed"
        }, StatusCode.UNAUTHORIZED)

        await dbConnect()

        const cachedCount = await valkey.get("batch_count");

        if (cachedCount !== null) {
            console.log("📦 Returning cached batch count");
            return createResponse({
                success: true,
                message: "Batches found (cached)",
                data: Number(cachedCount)
            }, StatusCode.OK)
        }

        const count = await Set.countDocuments();

        if (count === 0) return createResponse({
            success: false,
            message: "No Batches found",
            data: count
        }, StatusCode.NOT_FOUND)

        await valkey.setEx("batch_count", 600, String(count));

        return createResponse({
            success: true,
            message: "Batches found",
            data: count
        }, StatusCode.OK)


    } catch (error: any) {
        console.error("Error creating batch:", error);

        return createResponse(
            {
                success: false,
                message: "Error Feetching Batch Count",
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