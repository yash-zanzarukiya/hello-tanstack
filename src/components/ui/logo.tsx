import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  height?: string
}

export function Logo({ className, height = 'h-6' }: LogoProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <img
        src="/text-logo-light.svg"
        alt="ReCoil"
        className={cn(height, 'dark:hidden')}
      />
      <img
        src="/text-logo-dark.svg"
        alt="ReCoil"
        className={cn(height, 'hidden dark:block')}
      />
    </div>
  )
}
