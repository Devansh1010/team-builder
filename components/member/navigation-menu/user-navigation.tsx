import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

import { Button } from '@/components/ui/button'

export function UserNavigationMenu() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-300/50 bg-[#eeeeee]/80 backdrop-blur-md dark:border-white/5 dark:bg-[#111111]/80">
      <div className="mx-auto max-w-340 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
            TeamUp
          </span>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-8">

            {/* Group Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/member/dashboard"
                  className="group relative text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-white transition-all"
                >
                  <span className='text-[18px]'>Group</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Join Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/member/dashboard/join"
                  className="group relative text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-white transition-all"
                >
                  <span className='text-[18px]'>Join</span>

                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Profile Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/member/dashboard/profile"
                  className="group relative text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-white transition-all"
                >
                  <span className='text-[18px]'>Profile</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>


        {/* Action Area */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-500 transition-all rounded-full px-5"
          >
            <span className='text-[18px]'>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
