'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, ShieldCheck, Eye, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Dummy Authentication Logic
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('userRole', 'admin') // Full Access
        router.push('/')
      } else if (username === 'viewer' && password === 'viewer123') {
        localStorage.setItem('userRole', 'viewer') // Read Only Access
        router.push('/')
      } else {
        setError('Galat Username ya Password. Phir se try karein.')
        setIsLoading(false)
      }
    }, 800) // Thoda delay loading effect ke liye
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      
      {/* Login Card */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-lg">
        
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl inline-block mb-3">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">BLACK DIAMOND</h1>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all shadow-md"
          >
            {isLoading ? 'Logging in...' : 'Secure Login'}
          </Button>
        </form>
      </div>

      {/* Helper Box for Demo Credentials */}
      <div className="mt-8 grid grid-cols-2 gap-4 max-w-md w-full">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-xs font-bold text-blue-800 mb-1">ADMIN LOGIN</p>
          <p className="text-[10px] text-gray-600">User: <strong className="text-gray-900">admin</strong></p>
          <p className="text-[10px] text-gray-600">Pass: <strong className="text-gray-900">admin123</strong></p>
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-center">
          <Eye className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <p className="text-xs font-bold text-gray-800 mb-1">VIEWER LOGIN</p>
          <p className="text-[10px] text-gray-600">User: <strong className="text-gray-900">viewer</strong></p>
          <p className="text-[10px] text-gray-600">Pass: <strong className="text-gray-900">viewer123</strong></p>
        </div>
      </div>

    </div>
  )
}