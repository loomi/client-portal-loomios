import { PortalSidebar } from './_components/PortalSidebar'
import { PortalTopbar } from './_components/PortalTopbar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PortalSidebar />
      <div className="ml-60">
        <PortalTopbar />
        <main className="mx-auto max-w-4xl px-8 py-10">{children}</main>
      </div>
    </div>
  )
}
