import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/dbConnect';
import Admin from "@/models/admin.model";
import { createResponse, StatusCode } from '@/lib/createResponce';
import { sendVerification } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
    await dbConnect()
    try {

        const { username, email, password, fname, lname } = await request.json()

        console.log(username, email, fname, lname, password)

        const existingUserVerifiedByUsername = await Admin.findOne({
            username,
            isVerified: true
        })

        if (!username || !email || !password || !fname || !lname) {
            return createResponse({
                success: false,
                message: "missing fields"
            }, StatusCode.UNAUTHORIZED)
        }

        if (existingUserVerifiedByUsername) {
            return createResponse({
                success: false,
                message: "Username is already taken"
            }, StatusCode.BAD_REQUEST)
        }

        const existingUserByEmail = await Admin.findOne({ email })

        console.log("Existing User:- ", existingUserByEmail)

        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()


        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return createResponse({
                    success: false,
                    message: "User is verified"
                }, StatusCode.FORBIDDEN)
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)

                const updatedAdminDetails = await Admin.findOneAndUpdate(
                    { email },
                    {
                        username,
                        fname,
                        lname,
                        password: hashedPassword,
                        verifyCode,
                        verifyCodeExpires: new Date(Date.now() + 3600000)
                    },
                    { new: true, runValidators: false }
                )

                if(!updatedAdminDetails) return createResponse({
                    success: false,
                    message: "User not updated"
                }, StatusCode.CONFLICT)

                const emailResponce = await sendVerification(email, username, verifyCode)

                if (!emailResponce.success) {
                    return createResponse({
                        success: false,
                        message: emailResponce.message
                    }, StatusCode.INTERNAL_ERROR)
                }

                return createResponse({
                    success: true,
                    message: "Verify Code sent! Please Verify"
                }, StatusCode.OK)
            }

        } else {

            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = await Admin.create({
                username,
                fname,
                lname,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isVerified: false,
            })

            console.log(newUser)

            const emailResponce = await sendVerification(email, username, verifyCode)

            if (!emailResponce.success) {
                return createResponse({
                    success: false,
                    message: emailResponce.message
                }, StatusCode.INTERNAL_ERROR)
            }

            return createResponse({
                success: true,
                message: "Verify Code sent! Please Verify"
            }, StatusCode.OK)
        }

    } catch (error) {
        console.log("Error registering user", error)
        return createResponse({
            success: false,
            message: "Error while registering user"
        }, StatusCode.INTERNAL_ERROR)
    }
}
