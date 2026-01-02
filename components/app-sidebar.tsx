'use client'

import { Calendar, Home, Users, Sun, Moon, LogOut, LayoutDashboard, Settings } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from './signout-button'


// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Batches',
    url: '/admin/batches',
    icon: Users,
  },
  {
    title: 'Profile',
    url: '/admin/profile',
    icon: Calendar,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
]

export function AppSidebar() {
  const { setTheme } = useTheme()
  return (
    <Sidebar className="border-r border-slate-200 dark:border-zinc-800 transition-colors duration-300">
      <SidebarContent className="bg-white dark:bg-[#09090b]">
        <SidebarGroup>
          {/* BRANDING & THEME TOGGLE */}
          <SidebarGroupLabel asChild>
            <div className="flex justify-between items-center py-10 px-4 mb-2">
              <div className="flex items-center gap-2">
               
                <div className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-zinc-100">
                  TeamUp
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                    <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-slate-500" />
                    <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-slate-400" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
                  <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarGroupLabel>

          {/* NAVIGATION LINKS */}
          <SidebarGroupContent>
            <SidebarMenu className="px-3 space-y-1">
              {items.map((item: any) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group px-4 py-6 text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all duration-200"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER WITH YOUR SIGN-OUT COMPONENT */}
      <SidebarFooter className="p-4 bg-white dark:bg-[#09090b] border-t border-slate-100 dark:border-zinc-800/50">
        <div className="flex flex-col gap-2">
          {/* You can wrap your SignOut component in a styled div to match the sidebar's padding/alignment */}
          <div className="px-2">
            <div className="group flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-all cursor-pointer">
              <LogOut size={18} />
              <SignOut />
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 dark:text-zinc-600 uppercase tracking-widest mt-2">
            v1.0.4 Build
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
