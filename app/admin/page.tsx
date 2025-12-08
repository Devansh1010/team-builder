'use client'
import DashboardCard from '@/components/DashboardCard'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Moon, Sun, User } from 'lucide-react'

import { useState } from 'react'
import { toast } from "sonner"

const page = () => {
    const [theme, setTheme] = useState(true)

    return (
        <div className='w-full px-10 py-6'>
            <div className='w-full flex justify-between'>
                <div>
                    <h1 className="text-3xl font-bold ">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Monitor performance, insights, and system activity at a glance
                    </p>
                </div>

                <div className="flex gap-3">

                    <Button
                        variant="ghost"
                        className="hover:bg-gray-100"
                        onClick={() => setTheme((prev) => !prev)}
                    >
                        {theme ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
                    </Button>
                </div>

            </div>

            <div className='w-full'>
                <DashboardCard />
            </div>
        </div>
    )
}

export default page