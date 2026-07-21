'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Truck, Package, FileText, Zap, CreditCard, BarChart3 } from 'lucide-react'

const NavItem = ({ 
  href, 
  icon: Icon, 
  label, 
  isActive 
}: { 
  href: string
  icon: any
  label: string
  isActive: boolean
}) => (
  <Link href={href} className="flex-1 min-w-[60px] md:flex-none">
    <div className={`flex flex-col items-center justify-center gap-1 px-1 py-2 rounded-lg transition-all h-full w-full ${
      isActive 
        ? 'bg-blue-100 text-blue-700 font-semibold' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}>
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
      <span className="text-[10px] md:text-xs text-center line-clamp-1">{label}</span>
    </div>
  </Link>
)

export default function Navigation() {
  const pathname = usePathname()

  // Analytics yahan se hata diya gaya hai taaki phone pe slide na karna pade
  const navItems = [
    { href: '/', icon: Truck, label: 'Fleet', id: 'fleet' },
    { href: '/weighment', icon: Package, label: 'Weighment', id: 'weighment' },
    { href: '/delivery', icon: FileText, label: 'Delivery', id: 'delivery' },
    { href: '/blast', icon: Zap, label: 'Blast', id: 'blast' },
    { href: '/billing', icon: CreditCard, label: 'billing', id: 'billing' },
  ]

  return (
    <>
      {/* Fixed Top Navigation Bar (Header) */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-200 shadow-sm h-16 md:h-20 flex items-center px-3 md:px-8 z-50 justify-between">
        <div className="flex items-center gap-2 md:gap-3 shrink min-w-0">
          <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg">
  <img 
    src="/Logo.jpg" 
    alt="Company Logo" 
    className="w-full h-full object-contain" 
  />
</div>
          <div className="shrink min-w-0 pr-2">
            <h1 className="font-bold text-sm md:text-lg text-gray-900 truncate">BLACK DIAMOND EXPLOSIVE PVT LTD</h1>
            <p className="text-[13px] md:text-xs text-gray-600 truncate">TATA STEEL WEST BOKARO</p>
          </div>
        </div>

        {/* Analytics Button Top Header Par Shift Kar Diya */}
        <Link 
          href="/analytics" 
          className={`shrink-0 p-2 md:px-3 md:py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            pathname === '/analytics' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="hidden md:inline text-xs font-semibold">Analytics</span>
        </Link>
      </div>

      {/* Spacer for Top Header */}
      <div className="h-16 md:h-20" />

      {/* Fixed Bottom Navigation (Footer) - Ab bina scroll ke 5 items fit aayenge */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 h-[72px] flex items-center px-1 md:px-8 z-50 pb-safe">
        <nav className="flex justify-between items-center w-full gap-0.5 md:gap-4 overflow-visible">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </>
  )
}