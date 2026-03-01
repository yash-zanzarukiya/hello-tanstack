import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { MySideBarHeader } from '@/components/web/sidebar/mysidebar-header'
import { NavPrimary } from '@/components/web/sidebar/nav-primary'
import { NavUser } from '@/components/web/sidebar/nav-user'
import type { NavPrimaryItem, NavUserProps } from '@/types/types'
import { linkOptions } from '@tanstack/react-router'
import {
  BookmarkIcon,
  CompassIcon,
  GalleryVerticalEndIcon,
  ImportIcon,
} from 'lucide-react'

const appInfo = {
  name: 'ReCoil',
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
    icon: CompassIcon,
  },
])

export function AppSidebar({ user }: NavUserProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <MySideBarHeader appInfo={appInfo} />
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary navItems={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
