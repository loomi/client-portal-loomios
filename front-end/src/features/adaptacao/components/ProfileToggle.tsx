'use client'

import { cn } from '@/lib/utils'
import { PROFILE_LABEL, type Profile } from '../content'
import { useCommProfile } from '../profile-context'

const OPTIONS: Profile[] = ['negocio', 'tecnico']

/** Controle puro — recebe valor e onChange. Reusável em qualquer linha. */
export function SegmentedProfile({
  value,
  onChange,
  size = 'md',
}: {
  value: Profile
  onChange: (profile: Profile) => void
  size?: 'sm' | 'md'
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-surface p-1">
      {OPTIONS.map((option) => {
        const active = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={cn(
              'rounded-full uppercase tracking-[0.16em] transition-all',
              size === 'sm' ? 'px-3 py-1.5 text-[0.5625rem]' : 'px-4 py-2 text-[0.625rem]',
              active
                ? 'bg-brand-dark text-white'
                : 'text-foreground/55 hover:text-foreground',
            )}
          >
            {PROFILE_LABEL[option]}
          </button>
        )
      })}
    </div>
  )
}

/** Versão ligada ao perfil compartilhado do cliente em foco. */
export function ProfileToggle({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { profile, setProfile } = useCommProfile()
  return <SegmentedProfile value={profile} onChange={setProfile} size={size} />
}
