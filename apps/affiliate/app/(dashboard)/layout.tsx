import Link from 'next/link'
import { LayoutDashboard, Link2, BarChart2, Users, Wallet, Image, Tag, User, HeadphonesIcon, LogOut } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/links', label: 'Links', icon: Link2 },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/creatives', label: 'Creatives', icon: Image },
  { href: '/offers', label: 'Offers', icon: Tag },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/support', label: 'Support', icon: HeadphonesIcon },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="text-[#ff2d2d] font-bold text-lg">RedRake Partners</span>
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

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
