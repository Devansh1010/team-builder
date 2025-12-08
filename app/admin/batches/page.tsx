'use client'

import CreateBatch from '@/components/batch/createBatch'
import { Skeleton } from "@/components/ui/skeleton"
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
import Link from 'next/link'
const Page = () => {
    const [batches, setBatches] = useState<any[]>([])
    const [isGettingBatches, setIsgettingBatches] = useState(false)

    useEffect(() => {
        const getBatches = async () => {
            setIsgettingBatches(true)
            try {
                const res = await axios.get('/api/v1/batch/getAllBatches')
                if (res.data?.success) {
                    toast.success(res.data.message)
                    setBatches(res.data.data || [])
                }
            } catch (error) {
                toast.error("Error fetching batches.")
            } finally {
                setIsgettingBatches(false)
            }
        }
        getBatches()
    }, [])

    return (
        <div className='w-full px-10 py-6'>
            {/* Header */}
            <div className='flex justify-between items-center p-8 mb-6'>
                <h1 className='text-2xl font-semibold'>All Batches</h1>

                <div className="cursor-pointer">
                    <CreateBatch />
                </div>
            </div>

            {/* Batch List */}
            <div>
                {/* When loading: show 4 skeletons */}
                {isGettingBatches ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <Skeleton
                                key={idx}
                                className="h-[180px] w-full rounded-2xl 
                               bg-neutral-200 dark:bg-neutral-800"
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        {batches.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {batches.map((batch) => (
                                    <Link href={`/admin/batches/${batch._id}`} key={batch._id}>
                                        <Card
                                            className="group relative p-5 rounded-2xl 
                                bg-white dark:bg-neutral-900 
                                border border-neutral-200 dark:border-neutral-800 
                                shadow-sm hover:shadow-lg 
                                transition-all duration-300
                                hover:-translate-y-1"
                                        >
                                            {/* Top Row */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <Box className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {batch.batch_name}
                                                    </h2>
                                                </div>

                                                <span
                                                    className="text-xs px-2 py-1 rounded-md 
                                        bg-blue-50 dark:bg-blue-900/30 
                                        text-blue-600 dark:text-blue-300 
                                        border border-blue-100 dark:border-blue-800"
                                                >
                                                    Limit: {batch.limit}
                                                </span>
                                            </div>

                                            {/* Divider */}
                                            <div className="my-4 h-px bg-neutral-200 dark:bg-neutral-800" />

                                            {/* Stats Section */}
                                            <div className="flex items-end justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
                                                    <p className="text-4xl font-bold text-neutral-800 dark:text-neutral-100 leading-tight">
                                                        {batch.users.length}
                                                    </p>
                                                </div>

                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    Total Users
                                                </p>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 mt-10 text-lg">
                                No batches found.
                            </p>
                        )}
                    </>
                )}
            </div>


        </div>
    )
}

export default Page
