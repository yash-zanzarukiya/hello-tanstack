import type { User } from 'better-auth'
import type { LucideIcon } from 'lucide-react'

export interface NavPrimaryItem {
  name: string
  to: string
  activeOptions: { exact: boolean }
  icon: LucideIcon
}

export interface NavUserProps {
  user: User
}

export interface BulkScrapProgress {
  completed: number
  total: number
  url: string
  status: 'COMPLETED' | 'FAILED'
}
