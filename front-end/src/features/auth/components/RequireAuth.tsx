'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { tokenStore } from '@/lib/token-store'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data, isLoading, isError, isFetching } = useCurrentUser()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!tokenStore.getAccess()) {
      router.replace('/login')
    }
  }, [router])

  useEffect(() => {
    if (isError && !isFetching) {
      tokenStore.clear()
      router.replace('/login')
    }
  }, [isError, isFetching, router])

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        {isLoading ? <Loader2 className="size-5 animate-spin" /> : null}
      </div>
    )
  }

  return <>{children}</>
}
