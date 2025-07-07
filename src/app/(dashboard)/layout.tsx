import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Plus, Settings, Home } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">My MCP</span>
          </Link>
        </div>
        <nav className="px-4 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/add-server">
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}