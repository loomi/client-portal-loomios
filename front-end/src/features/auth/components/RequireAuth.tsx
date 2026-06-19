'use client'

// Auth desativada: a aplicação é aberta. Mantemos o componente como
// passthrough para não quebrar os layouts que o utilizam.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
