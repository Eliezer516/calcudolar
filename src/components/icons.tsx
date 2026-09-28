type IconProps = {
  className?: string
}

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export function SwapIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 4v14m0 0-3.2-3.2M7 18l3.2-3.2" />
      <path d="M17 20V6m0 0-3.2 3.2M17 6l3.2 3.2" />
    </svg>
  )
}

export function RefreshIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v6h-6" />
    </svg>
  )
}

export function BackspaceIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6H9.5a2 2 0 0 0-1.4.6L3.2 12l4.9 5.4a2 2 0 0 0 1.4.6H20a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" />
      <path d="m12 9.5 4 5m0-5-4 5" />
    </svg>
  )
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2.4" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A2.5 2.5 0 0 0 4 5.5v6A2.5 2.5 0 0 0 6.5 14" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  )
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 8.5v4.2" />
      <path d="M12 16.2h.01" />
      <circle cx="12" cy="12" r="8.6" />
    </svg>
  )
}
