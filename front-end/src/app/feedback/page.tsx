import type { Metadata } from 'next'

import { FloatingSidebar } from '@/components/FloatingSidebar'
import { ConversationView } from '@/features/feedback/components/ConversationView'

export const metadata: Metadata = {
  title: 'Conversar · Loomi',
  description: 'Conte como está sendo o projeto — a Loomi organiza o seu feedback.',
}

export default function FeedbackPage() {
  return (
    <>
      <FloatingSidebar />
      <ConversationView />
    </>
  )
}
