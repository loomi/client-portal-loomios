import Link from 'next/link'
import type { Material } from '../types'

function formatDate(value: string | null): string | null {
  if (!value) return null
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function MaterialItem({ material }: { material: Material }) {
  const delivered = formatDate(material.deliveredAt)

  return (
    <Link
      href={material.href}
      className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary/40"
    >
      <span className="flex flex-col">
        <span className="font-medium">{material.title}</span>
        <span className="text-xs text-muted-foreground">{material.kind}</span>
      </span>
      {delivered && (
        <span className="shrink-0 text-xs text-muted-foreground">{delivered}</span>
      )}
    </Link>
  )
}
