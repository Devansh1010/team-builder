'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-react'

export function UserNavigationMenu() {
  const { setTheme } = useTheme()

  // Shared class for nav links to keep it DRY (Don't Repeat Yourself)
  const navLinkClass = "text-[17px] font-medium transition-all text-gray-600 hover:text-sky-600 dark:text-gray-400 dark:hover:text-white"

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-300/50 bg-[#eeeeee]/80 backdrop-blur-md dark:border-white/5 dark:bg-[#111111]/80 transition-colors">
      <div className="mx-auto max-w-340 px-6 py-3 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
            TeamUp
          </span>
        </div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-8">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/member/dashboard" className={navLinkClass}>
                  Group
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/member/dashboard/join" className={navLinkClass}>
                  Join
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/member/dashboard/profile" className={navLinkClass}>
                  Profile
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-500 transition-all rounded-full px-5"
          >
            <span className='text-[18px] font-medium'>Logout</span>
          </Button>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent border-gray-300 dark:border-white/10 dark:text-white"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-[#161616] dark:border-white/10">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}