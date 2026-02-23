import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { MySideBarHeader } from '@/components/web/sidebar/mysidebar-header'
import {
  NavPrimary,
  type NavPrimaryItem,
} from '@/components/web/sidebar/nav-primary'
import { NavUser } from '@/components/web/sidebar/nav-user'
import {
  BookmarkIcon,
  GalleryVerticalEndIcon,
  ImportIcon,
  MapIcon,
} from 'lucide-react'
import { linkOptions } from '@tanstack/react-router'

const appInfo = {
  name: '<ReCoil/>',
  desc: 'Your AI Knowledge Base',
  logo: <GalleryVerticalEndIcon />,
}

const navItems: NavPrimaryItem[] = linkOptions([
  {
    name: 'Items',
    to: '/dashboard/items',
    activeOptions: { exact: false },
    icon: BookmarkIcon,
  },
  {
    name: 'Import',
    to: '/dashboard/import',
    activeOptions: { exact: false },
    icon: ImportIcon,
  },
  {
    name: 'Discover',
    to: '/dashboard/discover',
    activeOptions: { exact: false },
    icon: MapIcon,
  },
])

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <MySideBarHeader appInfo={appInfo} />
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary navItems={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
