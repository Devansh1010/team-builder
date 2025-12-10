import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { Button } from "@/components/ui/button"

export function UserNavigationMenu() {
    return (
        <div className="w-full border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">


                <div className="text-2xl font-semibold tracking-tight">
                    TeamUp
                </div>

                <NavigationMenu>
                    <NavigationMenuList className="space-x-6">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/member/dashboard" className="text-sm font-medium hover:text-primary transition">
                                    Group
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/member/dashboard/join" className="text-sm font-medium hover:text-primary transition">
                                    Join
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/member/dashboard/profile" className="text-sm font-medium hover:text-primary transition">
                                    Profile
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <Button variant="destructive" type="submit" className="px-5 cursor-pointer">
                    Logout
                </Button>


            </div>
        </div>
    )
}