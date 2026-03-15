import { createClientOnlyFn } from '@tanstack/react-start'
import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const copyToClipboard = createClientOnlyFn(async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  } catch (err) {
    toast.error('Failed to copy to clipboard.')
  }
})
