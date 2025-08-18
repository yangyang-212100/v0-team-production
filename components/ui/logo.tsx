import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src="/logo.png"
        alt="职得"
        className="w-full h-full object-contain"
      />
    </div>
  )
} 