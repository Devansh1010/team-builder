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

const DashboardCard = () => {

    const [batchCount, setBatchCount] = useState(-1)
    const [isGettingBatchCount, setIsGettingBatchCount] = useState(false)
    const [batchError, setBatchError] = useState('')

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

    useEffect(() => {
        getBatchCount()
    }, [])

    return (
        <div className='flex my-5 min-h-60 w-full items-center gap-2'>

            <CardTemplete
                title="Users"
                description="Active Members"
                icon={<User className="w-6 h-6 text-blue-400" />}
                content="1,245"
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