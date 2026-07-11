import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Megaphone, 
  Wallet, 
  UserCircle, 
  ShieldAlert, 
  CheckSquare, 
  Calendar, 
  FileText, 
  BookOpen, 
  Bot, 
  Bell, 
  BarChart3, 
  Settings, 
  Blocks,
  History,
  Activity,
  Search,
  Menu,
  X
} from 'lucide-react'
import { cn } from '../lib/utils'
import { hasAccess } from '../lib/permissions'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Influencers', href: '/influencers', icon: Users },
  { name: 'Theme Influencers', href: '/theme-influencers', icon: Users },
  { name: 'Brands', href: '/brands', icon: Building2 },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Finance', href: '/finance', icon: Wallet },
  { name: 'Employees', href: '/employees', icon: UserCircle },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
  { name: 'AI Assistant', href: '/ai', icon: Bot },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  let role = ''
  try {
    role = localStorage.getItem('upio_auth') || ''
  } catch (e) {}
  const allowedNavigation = navigation.filter(item => hasAccess(role, item.href))

  const userInitials = role === 'founder' ? 'JD' : (role === 'cofounder' ? 'P5' : (role === 'finance' ? 'FN' : (role === 'research' ? 'RS' : 'EM')))
  const userName = role === 'founder' ? 'James Upio' : (role === 'cofounder' ? 'Prithvi' : (role === 'finance' ? 'Finance Team' : (role === 'research' ? 'Research Team' : 'Employee')))
  const userRoleStr = role === 'founder' ? 'Founder (Admin)' : (role === 'cofounder' ? 'Co-Founder (Admin)' : role.charAt(0).toUpperCase() + role.slice(1))

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 flex flex-col border-r border-zinc-200 dark:border-zinc-800">
          <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 justify-between">
            <span className="font-bold text-lg tracking-tight">UPIO OS</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5 text-zinc-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {allowedNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-zinc-100 dark:bg-[#1C1C1F] text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-[#A1A1AA] hover:bg-zinc-50 dark:hover:bg-transparent dark:hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-zinc-200 lg:dark:border-[#27272A] lg:bg-white lg:dark:bg-[#0C0C0E]">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-[#27272A] gap-3">
          <div className="h-8 w-8 bg-zinc-900 dark:bg-white rounded-md flex items-center justify-center shrink-0">
            <div className="w-4 h-4 border-2 border-white dark:border-[#09090B] rotate-45"></div>
          </div>
          <span className="font-bold text-lg tracking-tight dark:text-[#FAFAFA]">
            UPIO <span className="text-zinc-500 dark:text-[#A1A1AA] font-normal underline decoration-primary dark:decoration-[#F27D26]">OS</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {allowedNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-[#27272A]">
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-[#18181B] p-3 rounded-xl border border-zinc-200 dark:border-[#27272A]">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-[#27272A] border border-zinc-300 dark:border-[#3F3F46] flex items-center justify-center font-bold text-xs uppercase text-zinc-900 dark:text-white">
              {userInitials}
            </div>
            <div className="overflow-hidden flex flex-col">
              <span className="text-xs font-semibold truncate dark:text-white">{userName}</span>
              <span className="text-[10px] text-zinc-500 dark:text-[#71717A]">{userRoleStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-200 dark:border-[#27272A] bg-white dark:bg-[#09090B]/50 dark:backdrop-blur-sm">
          <button
            className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-1 flex items-center gap-4 lg:gap-8 max-w-2xl mx-auto lg:mx-0 lg:ml-8">
            <div className="relative w-full max-w-md hidden sm:flex items-center bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-[#27272A] rounded-md px-3 py-1.5">
              <span className="text-zinc-500 dark:text-[#71717A] text-sm">/ Search anything...</span>
              <span className="ml-auto text-[10px] bg-zinc-200 dark:bg-[#27272A] px-1.5 py-0.5 rounded text-zinc-600 dark:text-[#A1A1AA] font-mono tracking-tighter">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-primary/10 dark:bg-[#F27D26]/10 text-primary dark:text-[#F27D26] px-3 py-1 rounded-full border border-primary/20 dark:border-[#F27D26]/20">
              <span className="w-2 h-2 rounded-full bg-primary dark:bg-[#F27D26] animate-pulse"></span>
              <span className="text-xs font-medium">AI Engine Active</span>
            </div>
            <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-zinc-900" />
            </button>
            <button onClick={() => {
              try { localStorage.removeItem('upio_auth') } catch (e) {}
              window.location.reload()
            }} className="text-xs text-zinc-500 hover:text-red-500 underline ml-2">
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
