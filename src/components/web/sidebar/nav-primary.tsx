import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

export interface NavPrimaryItem {
  name: string
  to: string
  activeOptions: { exact: boolean }
  icon: LucideIcon
}

export function NavPrimary({ navItems }: { navItems: NavPrimaryItem[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Hello World</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                to={item.to}
                activeOptions={item.activeOptions}
                activeProps={{ 'data-active': true }}
              >
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
