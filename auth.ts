import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { dbConnect } from "@/lib/dbConnect"
import Admin from "./models/admin.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },

            authorize: async (credentials: any): Promise<any> => {
                await dbConnect();
                console.log(credentials.email)
                console.log(credentials.password)

                try {
                    const user = await Admin.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email }
                        ]
                    })

                    console.log("User: ______", user)

                    if (!user) {
                        throw new Error("No user found")
                    }

                    const isValid = bcrypt.compare(credentials.password, user.password);
                    

                    if (!isValid) {
                        throw new Error("Not authorized")
                    }

                    return user
                } catch (error: any) {
                    console.error("Authorization Error:", error.message);
                    throw new Error("Error checking user")
                }
            },
        }),
        
    ],


    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user._id?.toString()
                token.email = user.email
                token.isVerified = user.isVerified
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id as string
            session.user.email = token.email as string
            session.user.isVerified = token.isVerified as boolean
            return session
        },
    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in"
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },

    secret: process.env.AUTH_SECRET
})