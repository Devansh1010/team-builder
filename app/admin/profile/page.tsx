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
        <div className="w-full flex justify-center py-10">
            <Card className="w-full max-w-2xl shadow-sm border rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Admin Profile
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-2">
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


                    </div>

                    {/* Grid Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">First Name</Label>
                            <p className="font-medium">{admin.fname || "—"}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">Last Name</Label>
                            <p className="font-medium">{admin.lname || "—"}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">Username</Label>
                            <p className="font-medium">{admin.username || "—"}</p>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">Email</Label>
                            <p className="font-medium">{admin.email || "—"}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center border p-3 rounded-lg  mt-4">
                        <Label>Status</Label>

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${admin.isVerified
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {admin.isVerified ? "Verified" : "Not Verified"}
                        </span>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
