"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";

//table
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import UpdateBatch from "@/components/batch/updateBatch";



export default function Page({ params }: { params: { id: string } }) {

    type BatchUser = {
        id: string;
        email: string;
        status: "pending" | "approved";
        username?: string;
    };

    const [resolvedId, setResolvedId] = useState<string>('');
    const [batch, setBatch] = useState<Record<string, any>>({});
    const [users, setUsers] = useState<BatchUser[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // const [sorting, setSorting] = useState<SortingState>([])

    async function sample() {
        const { id } = await params;
        setResolvedId(id);
    }

    const getBatch = async () => {
        setIsLoading(true);
        setError("");

        try {
            const res = await axios.get(`/api/v1/batch/getBatchById?batchId=${resolvedId}`);

            if (res.data.success) {
                const emailsObj = res.data.data.users; // {0: "a@gmail.com", 1: "b@gmail.com"}

                const formattedUsers = Object.values(emailsObj).map(email => ({
                    id: crypto.randomUUID(),  // or any id you want to generate
                    email: email as string,
                    status: "pending" as const,
                    username: undefined
                }));

                setBatch(res.data.data);
                setUsers(formattedUsers);
                toast.success("Batch loaded");
            } else {
                setError("Unable to fetch batch");
                toast.error("Unable to fetch batch");
            }
        } catch (err) {
            setError("Something went wrong while fetching data");
            toast.error("Fetch failed");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        sample();
    }, []);

    useEffect(() => {
        if (!resolvedId) return;
        getBatch();
    }, [resolvedId]);

    console.log(users)


    return (
        <div className="w-full mx-auto px-10 py-6">

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            )}

            {!isLoading && error && (
                <div className="text-center text-red-500 font-medium py-10">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="w-full p-8 rounded-2xl shadow-sm">

                    {/* HEADER */}
                    <div className="flex justify-between items-center px-1 mb-6">
                        <div>
                            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                                {batch.batch_name}
                            </h1>
                            <div className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
                                Batch Details Overview
                            </div>
                        </div>

                        <div className="cursor-pointer">
                           <UpdateBatch id={`${resolvedId}`}/>  
                        </div>

                    </div>

                    {/* INFO GRID */}
                    <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-800 p-5 rounded-xl mb-8">
                        <div className="flex justify-center items-center gap-2">
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Limit</span>
                            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                {batch.limit}
                            </span>
                        </div>

                        <div className="flex flex-col">

                            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <Users className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                {batch.users?.length ?? 0}
                            </span>
                        </div>

                    </div>

                    
                    {users.length != 0 && <DataTable columns={columns} data={users} />}

                </div>
            )}
        </div>
    );
}
