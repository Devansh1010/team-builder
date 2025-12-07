'use client'

import CreateBatch from '@/components/batch/createBatch'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Users, Box } from "lucide-react";
const Page = () => {
    const [batches, setBatches] = useState<any[]>([])

    useEffect(() => {
        const getBatches = async () => {
            try {
                const res = await axios.get('/api/v1/batch/getAllBatches')

                if (res.data?.success) {
                    toast.success(res.data.message)
                    setBatches(res.data.data || [])
                } else {
                    toast.info(res.data?.message || "No batches found.")
                }
            } catch (error) {
                toast.error("Error fetching batches.")
            }
        }

        getBatches()
    }, [])

    return (
        <div className='w-full px-10 py-6'>
            {/* Header */}
            <div className='flex justify-between items-center px-10 mb-6'>
                <h1 className='text-2xl font-semibold'>All Batches</h1>
                <CreateBatch />
            </div>

            {/* Batch List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {batches.length > 0 ? (
                    batches.map((batch) => (
                        <Card
                            key={batch._id}
                            className="p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-transform duration-200"
                        >
                            {/* Limit at top-right */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Box className="w-5 h-5 text-blue-500" /> {/* Batch icon */}
                                    {batch.batch_name}
                                </h2>
                                <p className="text-sm text-gray-500">Limit: {batch.limit}</p>
                            </div>

                            {/* Total Users */}
                            <div className="flex items-center gap-3">
                                <div className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-gray-600" />
                                    {batch.users.length}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Users</p>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-10 text-lg">
                        No batches found.
                    </p>
                )}
            </div>

        </div>
    )
}

export default Page
