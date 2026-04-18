import Link from 'next/link'
import { LayoutDashboard, Users, Megaphone, Target, DollarSign, ShieldAlert, FileVideo, Globe, Settings, LogOut } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/affiliates', label: 'Affiliates', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/leads', label: 'Leads', icon: Target },
  { href: '/finance', label: 'Finance', icon: DollarSign },
  { href: '/traffic', label: 'Traffic & Fraud', icon: ShieldAlert },
  { href: '/content', label: 'Content', icon: FileVideo },
  { href: '/compliance', label: 'Compliance', icon: Globe },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <aside className="w-60 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="text-[#ff2d2d] font-bold text-lg">RedRake Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <form action="/api/auth/sign-out" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
