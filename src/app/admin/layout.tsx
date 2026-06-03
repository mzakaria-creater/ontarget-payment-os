import { Sidebar } from '@/components/layout/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar role="admin" />
      <div className="flex-1 ml-[240px] min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  )
}
