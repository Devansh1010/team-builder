'use client'
import DashboardCard from '@/components/DashboardCard'


const page = () => {
    

    return (
        <div className='w-full px-10 py-6'>
            <div className='w-full flex justify-between p-8 mb-6'>
                <div>
                    <h1 className="text-2xl font-semibold ">
                        Admin Dashboard
                    </h1>
                </div>

            </div>

            <div className='w-full'>
                <DashboardCard />
            </div>
        </div>
    )
}

export default page