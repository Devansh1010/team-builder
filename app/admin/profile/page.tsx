"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { toast } from "sonner"

export default function AdminProfilePage() {
    const [admin, setAdmin] = useState({
        username: "",
        fname: "",
        lname: "",
        email: "",
        isVerified: false,
        imageUrl: "",
    })

    const [isGettingProfile, setIsGettingProfile] = useState(false);

    const getProfile = async () => {
        setIsGettingProfile(true);

        try {
            const response = await axios.get("/api/v1/users/getProfile");
            const { success, data } = response.data;

            if (success) {
                setAdmin(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsGettingProfile(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    console.log(admin)
    return (
        <div className="w-full px-10 py-6">


            <div className="p-8 mb-6  space-y-8">
                {/* ROW 1 — Image + Username */}
                <div className="flex flex-col md:flex-row items-center gap-6 ">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                        {admin.imageUrl ? (
                            <img
                                src={admin.imageUrl}
                                alt="Admin Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Username */}
                    <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Username</Label>
                        <p className="text-lg font-semibold">{admin.username || "—"}</p>
                    </div>
                </div>

                {/* ROW 2 — First Name + Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">First Name</Label>
                        <p className="font-medium">{admin.fname || "—"}</p>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Last Name</Label>
                        <p className="font-medium">{admin.lname || "—"}</p>
                    </div>
                </div>

                {/* ROW 3 — Email + Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Email */}
                    <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="font-medium">{admin.email || "—"}</p>
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Status</Label>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${admin.isVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {admin.isVerified ? "Verified" : "Not Verified"}
                        </span>
                    </div>

                </div>
            </div>

        </div>

    )
}
