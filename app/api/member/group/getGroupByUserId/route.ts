import { createResponse, StatusCode } from "@/lib/createResponce";
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import Group from "@/models/user_models/group.model";
import { VerifyUser } from "@/lib/verifyUser/userVerification";
import User from "@/models/user_models/user.model";


export async function GET() {
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

    const user = await User.findById(data.id).select('groups')

    const userGroups = user?.groups || [];

    if (userGroups.length === 0) {
      return createResponse(
        { success: false, message: "Not part of any Group" },
        StatusCode.NOT_FOUND
      );
    }

    // extract groupIds
    const groupIds = userGroups.map((g: any) => g.groupId);

    // fetch all matching groups
    const allGroups = await Group.find({
      _id: { $in: groupIds }
    })
    console.log(allGroups)

    return createResponse(
      {
        success: false,
        message: "Found Group For User",
        data: allGroups
      },
      StatusCode.OK
    );
  } catch (error) {
    return createResponse({
      success: false,
      message: "Error While Fetching Group",
      data: error
    }, StatusCode.INTERNAL_ERROR);
  }

}