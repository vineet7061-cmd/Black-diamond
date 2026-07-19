'use client'

import { useState } from 'react'
import { Truck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Successful login ke baad yahan wapas aayega
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : 'http://localhost:3000'
      }
    })

    if (error) {
      alert("Login failed: " + error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      
      {/* Login Card */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
        
        <div className="mb-8">
          <div className="bg-blue-600 p-3 rounded-xl inline-block mb-3 shadow-md">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">BLACK DIAMOND</h1>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Management System</p>
        </div>

        <div className="mb-8">
          <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3 opacity-20" />
          <p className="text-gray-600 font-medium text-sm">Please sign in with your authorized Google account to access the dashboard and manage operations securely.</p>
        </div>

        <Button 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-blue-200 text-gray-900 font-bold py-6 text-lg rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm"
        >
          {isLoading ? (
            'Connecting to Google...'
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
      <div className="mt-8 text-center max-w-md w-full">
         <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Restricted Access • Authorized Personnel Only</p>
      </div>
    </div>
  )
}