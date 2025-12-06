import React from 'react'
import CardTemplete from './CardTemplete'
import {
  Users,
  LineChart,
  Bell,
  Settings,
  User,
  GalleryHorizontalEnd,
} from "lucide-react";
const DashboardCard = () => {
    return (
        <div className='flex my-5 min-h-60 w-full items-center gap-2'>
            <CardTemplete
                title="Users"
                description="Active Members"
                icon={<User  className="w-6 h-6 text-blue-400" />}
                content="1,245"
                footer="Updated 5 mins ago"
            />

            <CardTemplete
                title="Batches"
                description="This Month"
                icon={<Users className="w-6 h-6 text-green-400" />}
                content="$12.4k"
                footer="Compared to last month"
            />

            <CardTemplete
                title="Courses"
                description="Configuration"
                icon={<GalleryHorizontalEnd  className="w-6 h-6 text-purple-400" />}

                content="12"
                footer="Custom rules applied"
            />

        </div>
    )
}

export default DashboardCard