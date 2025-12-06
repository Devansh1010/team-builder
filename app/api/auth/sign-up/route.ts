import bcrypt from 'bcryptjs'
// import { sendVerification } from "@/helpers/sendVerificationEmail";
import { dbConnect } from '@/lib/dbConnect';
import Admin from "@/models/admin.model";
import { createResponse, StatusCode } from '@/lib/createResponce';

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
            return Response.json({
                success: false,
                message: "missing fields"
            }, { status: 401 })
        }

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await Admin.findOne({ email })

        console.log("Existing User:- ", existingUserByEmail)

        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()


        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User is verified"
                }, { status: 405 });

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

                // const emailResponce = await sendVerification(email, username, verifyCode)

                // if (!emailResponce.success) {
                //     return Response.json({
                //         success: false,
                //         message: emailResponce.message
                //     }, { status: 501 })
                // }

                return Response.json({
                    success: true,
                    message: "Verify Code sent! Please Verify"
                }, { status: 200 })

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

            // const emailResponce = await sendVerification(email, username, verifyCode)

            // if (!emailResponce.success) {
            //     return Response.json({
            //         success: false,
            //         message: emailResponce.message
            //     }, { status: 501 })
            // }

            return Response.json({
                success: true,
                message: "Verify Code sent! Please Verify"
            }, { status: 200 })
        }



    } catch (error) {
        console.log("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error while registering user"
        },
            {
                status: 500
            }
        )
    }
}

