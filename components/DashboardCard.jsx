import { useEffect, useState } from 'react'
import CardTemplete from './CardTemplete'
import {
    Users,
    User,
    GalleryHorizontalEnd,
    Loader2
} from "lucide-react";
import axios from 'axios';
import Link from 'next/link';
import { number } from 'zod';

const DashboardCard = () => {

    const [batchCount, setBatchCount] = useState(-1)
    const [userCount, setUserCount] = useState(-1)
    const [isGettingBatchCount, setIsGettingBatchCount] = useState(false)
    const [isGettingUserCount, setIsGettingUserCount] = useState(false)
    const [batchError, setBatchError] = useState('')
    const [userError, setUserError] = useState('')

    async function getBatchCount() {
        setIsGettingBatchCount(true)
        const res = await axios.get('/api/v1/batch/getBatchesCount')
        console.log(res.data.data)

        if (res?.data.success) {
            setBatchCount(res.data.data)
            setIsGettingBatchCount(false)
            return
        } else {
            setBatchError('?')
            setIsGettingBatchCount(false)
        }
    }

    async function getUserCount() {
        setIsGettingUserCount(true)
        const res = await axios.get('/api/v1/users/getAllUserCount')
        console.log(res.data.data)

        if (res?.data.success) {
            setUserCount(res.data.data)
            setIsGettingUserCount(false)
            return
        } else {
            setUserError('?')
            setIsGettingUserCount(false)
        }
    }


    useEffect(() => {
        getBatchCount()
    }, [])

     useEffect(() => {
        getUserCount()
    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5 w-full">

            <CardTemplete
                title="Users"
                description="Active Members"
                icon={<User className="w-6 h-6 text-blue-400" />}
                content={
                    isGettingUserCount ? (
                        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                    ) : userCount === -1 ? (
                        <div>{userError}</div>
                    ) : (
                        <div>{userCount}</div>
                    )
                }
                footer="Updated 5 mins ago"
            />

            <Link href={'/admin/batches'}>
                <CardTemplete
                    title="Batches"
                    description="This Month"
                    icon={<Users className="w-6 h-6 text-green-400" />}
                    content={
                        isGettingBatchCount ? (
                            <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                        ) : batchCount === -1 ? (
                            <div>{batchError}</div>
                        ) : (
                            <div>{batchCount}</div>
                        )
                    }
                    footer="Compared to last month"
                />
            </Link>

            <CardTemplete
                title="Courses"
                description="Configuration"
                icon={<GalleryHorizontalEnd className="w-6 h-6 text-purple-400" />}
                content="12"
                footer="Custom rules applied"
            />

        </div>

    )
}

export default DashboardCard