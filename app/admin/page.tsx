'use client'
import DashboardCard from '@/components/DashboardCard'

import { Button } from '@/components/ui/button'
import { Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useState } from 'react'
import { toast } from "sonner"

const page = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div className='w-full px-10 py-6'>
            <div className='w-full flex justify-between p-8 mb-6'>
                <div>
                    <h1 className="text-2xl font-semibold ">
                        Admin Dashboard
                    </h1>

                </div>

                <div className="flex gap-3 ">

                    <Button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                        {theme === "light" ? <Moon /> : <Sun />}
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