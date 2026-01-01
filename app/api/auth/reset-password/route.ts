import { auth } from "@/auth";
import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import valkey from '@/lib/valkey';
import Admin from "@/models/admin.model";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs"; // Recommendation: Hash the password!

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const { newPassword } = await req.json();

        // 1. Validation: Check for missing fields
        if (!token || !newPassword) {
            return createResponse(
                { success: false, message: "Missing token or password" },
                StatusCode.BAD_REQUEST
            );
        }

        if (newPassword.length < 8) {
            return createResponse(
                { success: false, message: "Password must be at least 8 characters" },
                StatusCode.BAD_REQUEST
            );
        }

        // 2. Token Verification: Check Valkey
        const userEmailFromToken = await valkey.get(`reset_token:${token}`);

        if (!userEmailFromToken) {
            return createResponse(
                { success: false, message: "Invalid or expired token" },
                StatusCode.UNAUTHORIZED
            );
        }

        await dbConnect();

        // 3. Security: Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update Admin by Email (found in Valkey)
        const updatedUserPassword = await Admin.findOneAndUpdate(
            { email: userEmailFromToken },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUserPassword) {
            return createResponse(
                { success: false, message: "User account not found" },
                StatusCode.NOT_FOUND
            );
        }

        // 5. Cleanup: Delete the token so it can't be used again
        await valkey.del(`reset_token:${token}`);

        return createResponse(
            { success: true, message: "Password updated successfully" },
            StatusCode.OK
        );

    } catch (error: any) {
        console.error("RESET_PASSWORD_ERROR:", error);
        return createResponse(
            { success: false, message: "An unexpected error occurred" },
            StatusCode.INTERNAL_ERROR
        );
    }
}