import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import Group from "@/models/user_models/group.model";
import { VerifyUser } from "@/lib/verifyUser/userVerification";

export async function GET(req: NextRequest) {

    try {
        const auth = await VerifyUser();

        if (!auth.success) {
            return auth.response;
        }

        const data = auth.user;

        if (!data) {
            return createResponse(
                { success: false, message: "Unauthorized" },
                StatusCode.UNAUTHORIZED
            );
        }

        await dbConnect()

        const allGroups = await Group.find({}) .select('_id name desc techStack accessTo');

        if (allGroups.length === 0) {
            return createResponse(
                { success: false, message: "No Groups Created" },
                StatusCode.NOT_FOUND
            );
        }

        return createResponse(
            {
                success: true,
                message: "Found Some Groups",
                data: allGroups
            },
            StatusCode.OK
        );
    } catch (error) {
        return createResponse({
            success: false,
            message: "Error While Fetching Groups",
            data: error
        }, StatusCode.INTERNAL_ERROR);
    }
}