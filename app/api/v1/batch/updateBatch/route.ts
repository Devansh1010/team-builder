import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import Set from "@/models/users.model";
import { NextRequest } from "next/server";
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session || !session?.user) return createResponse({
            success: false,
            message: "User Not Allowed"
        }, StatusCode.UNAUTHORIZED)

        const { searchParams } = new URL(req.url);

        // Get specific query parameter
        const batchId = searchParams.get("batchId");
        console.log("BatchId:- ", batchId)

        const {name, limit} = await req.json()

        if (!batchId || batchId === "undefined" || batchId === "null") {
            return createResponse({
                success: false,
                message: "Invalid or missing batchId",
                data: {}
            }, StatusCode.BAD_REQUEST);
        }

        await dbConnect()

        const batch = await Set.findOneAndUpdate({ _id: batchId },{
            batch_name: name,
            limit
        }, {new: true});

        if (!batch) return createResponse({
            success: false,
            message: "Batch not updated",
            data: {}
        }, StatusCode.NOT_FOUND)

        return createResponse({
            success: true,
            message: "Batch updated successfully",
            data: batch
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