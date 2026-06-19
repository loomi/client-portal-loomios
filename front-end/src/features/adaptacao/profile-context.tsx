'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Profile } from './content'

// O perfil de comunicação do cliente em foco (Helios Energia) é compartilhado
// entre a tela da Loomi e o portal do cliente. Atribuir num lugar reflete no
// outro — prova que o sistema é coerente. Persistido em localStorage para
// sobreviver a um refresh durante a demo.

const STORAGE_KEY = 'loomi:comm-profile'

interface ProfileContextValue {
  profile: Profile
  setProfile: (profile: Profile) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function CommunicationProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile>('negocio')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'negocio' || stored === 'tecnico') {
      setProfileState(stored)
    }
  }, [])

  const setProfile = (next: Profile) => {
    setProfileState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useCommProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) {
    throw new Error('useCommProfile precisa estar dentro de <CommunicationProfileProvider>')
  }
  return ctx
}
