import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import Set from "@/models/batch.model";
import { NextRequest } from "next/server";
import { auth } from "@/auth"
import valkey from '@/lib/valkey'

export async function GET(req: NextRequest) {
    try {

        const session = await auth()

        if (!session || !session?.user) return createResponse({
            success: false,
            message: "User Not Allowed"
        }, StatusCode.UNAUTHORIZED)

        await dbConnect()

        //try to fetch from catchMemory
        const cached = await valkey.get("all_batches");
        if (cached) {
            return createResponse({
                success: true,
                message: "Batches found (cached)",
                data: JSON.parse(cached),
            }, StatusCode.OK);
        }

        const allBatches = await Set.find({}).sort({ createdAt: -1 })

        if (allBatches.length === 0) return createResponse({
            success: false,
            message: "No Batches found",
            data: []
        }, StatusCode.NOT_FOUND)


        await valkey.set("all_batches", JSON.stringify(allBatches));

        return createResponse({
            success: true,
            message: "Batches found",
            data: allBatches
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