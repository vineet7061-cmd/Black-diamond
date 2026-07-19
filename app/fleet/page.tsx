'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, Scale, FileText, User, LogOut, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

export default function HomePage() {
  const router = useRouter()
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/login')
      else setIsAuthLoading(false)
    }
    checkAuth()
  }, [router])

  if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <h1 className="font-black text-xl">BLACK DIAMOND</h1>
        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="bg-gray-100 p-2 rounded-full"><User /></button>
        {isProfileOpen && (
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="absolute right-4 top-16 bg-white border p-2 text-red-600 font-bold shadow-lg rounded-lg">Logout</button>
        )}
      </header>
      
      <main className="p-6 grid grid-cols-1 gap-6">
        <button onClick={() => router.push('/fleet')} className="bg-white p-8 rounded-2xl border flex flex-col items-center gap-4 hover:border-blue-500">
          <Truck className="w-12 h-12 text-blue-600" />
          <span className="font-black text-xl uppercase">Fleet</span>
        </button>
        <button onClick={() => alert("Coming Soon!")} className="bg-white p-8 rounded-2xl border flex flex-col items-center gap-4 hover:border-emerald-500">
          <Scale className="w-12 h-12 text-emerald-600" />
          <span className="font-black text-xl uppercase">Weighment</span>
        </button>
        <button onClick={() => alert("Coming Soon!")} className="bg-white p-8 rounded-2xl border flex flex-col items-center gap-4 hover:border-purple-500">
          <FileText className="w-12 h-12 text-purple-600" />
          <span className="font-black text-xl uppercase">Chalan</span>
        </button>
      </main>
      <Navigation />
    </div>
  )
}