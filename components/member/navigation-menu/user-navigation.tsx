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

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-black/80 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">

        {/* Brand: High-Contrast & Bold */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-8 w-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
            <span className="text-white dark:text-black font-black text-xl">T</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            TeamUp
          </span>
        </div>

        {/* Navigation: Minimalist Underline Style */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex items-center gap-10">
            {['Group', 'Join', 'Profile'].map((item) => (
              <NavigationMenuItem key={item}>
                <NavigationMenuLink asChild>
                  <Link
                    href={`/member/dashboard/${item === 'Group' ? '' : item.toLowerCase()}`}
                    className="group relative py-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                  >
                    {item}
                    
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Action Area: Sharp & Functional */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all px-4"
          >
            Logout
          </Button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" /> {/* Divider */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <DropdownMenuItem className="font-bold text-xs uppercase tracking-widest" onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-xs uppercase tracking-widest" onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-xs uppercase tracking-widest" onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}