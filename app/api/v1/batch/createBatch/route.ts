import { auth } from "@/auth";
import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import Set from "@/models/users.model";
import { NextRequest } from "next/server";
import valkey from "@/lib/valkey";
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session?.user) return createResponse({
      success: false,
      message: "User Not Allowed"
    }, StatusCode.UNAUTHORIZED)

    const body = await req.json();
    const emailArray = body.data
    const batch_name = body.name.trim()
    const limit = Number(body.limit)
    //Ensure if data is Array or not
    if (!Array.isArray(emailArray)) {
      return createResponse(
        { success: false, message: "Need Array of Data" },
        StatusCode.BAD_REQUEST
      );
    }

    function extractEmail(obj: Record<string, any>) {
      const emailKeys = [
        "email",
        "emails",
        "e-mail",
        "mail",
        "useremail",
        "user_email",
        "contact",
      ];

      for (const key of Object.keys(obj)) {
        const normalized = key.toLowerCase().replace(/\s+/g, "");
        if (emailKeys.includes(normalized)) {
          return obj[key];
        }
      }

      return null;
    }


    // Extract emails safely
    const emails = emailArray
      .map((obj: Record<string, any>) => extractEmail(obj))
      .filter((email) => typeof email === "string" && email.trim() !== "");


    if (emails.length === 0) {
      return createResponse(
        { success: false, message: "No valid emails found in data" },
        StatusCode.BAD_REQUEST
      );
    }

    await dbConnect();

    //check if already exist or not
    const isExist = await Set.findOne({ batch_name })

    if (isExist) return createResponse(
      { success: false, message: "Batch Already Exist" },
      StatusCode.BAD_REQUEST
    );

    //remove the old count
    await valkey.del("batch_count");
    
    // Create batch with emails directly
    const set = await Set.create({
      batch_name,
      limit,
      users: emails,
    });

    if (!set) {
      return createResponse(
        { success: false, message: "Batch Not Created" },
        StatusCode.CONFLICT
      );
    }

    return createResponse(
      { success: true, message: "Batch created Successfully" },
      StatusCode.CREATED
    );
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