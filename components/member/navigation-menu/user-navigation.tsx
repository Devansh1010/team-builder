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
    <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-340 px-2 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          TeamUp
        </div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-6">
            {[
              { label: 'Group', href: '/member/dashboard' },
              { label: 'Join', href: '/member/dashboard/join' },
              { label: 'Profile', href: '/member/dashboard/profile' },
            ].map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="
                  text-sm font-medium text-gray-600 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-gray-100
                  transition-colors
                "
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Logout */}
        <Button
          variant="outline"
          type="submit"
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
