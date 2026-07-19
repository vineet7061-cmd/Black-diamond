'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, ShieldCheck, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true)
    setErrorMsg('')
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : 'https://black-diamond-puce.vercel.app'
      }
    })

    if (error) {
      setErrorMsg("Google Login failed: " + error.message)
      setIsLoadingGoogle(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingEmail(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg("Access Denied: " + error.message)
      setIsLoadingEmail(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center items-center p-4">
      
      {/* Premium Login Card */}
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>

        <div className="mb-8 mt-2">
          <div className="bg-neutral-900 p-4 rounded-2xl inline-block mb-4 shadow-lg">
            <Truck className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">BLACK DIAMOND</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Management System</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div className="relative text-left">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">User Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your authorized email"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="relative text-left">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                required
              />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isLoadingEmail || isLoadingGoogle}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl transition-all shadow-md shadow-blue-200"
          >
            {isLoadingEmail ? 'Authenticating...' : 'Secure Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest absolute">Or</span>
        </div>

        {/* Google Auth Button */}
        <Button 
          onClick={handleGoogleLogin} 
          type="button"
          disabled={isLoadingGoogle || isLoadingEmail}
          className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-bold py-6 text-base rounded-xl flex items-center justify-center gap-3 transition-all"
        >
          {isLoadingGoogle ? (
            'Connecting to Workspace...'
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </div>
      
      {/* Security Note */}
      <div className="mt-8 flex flex-col items-center gap-2">
         <ShieldCheck className="w-6 h-6 text-gray-500 opacity-50" />
         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Restricted Access • Authorized Personnel Only</p>
      </div>
    </div>
  )
}