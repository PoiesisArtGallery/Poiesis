"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginModal({ open, setOpen }: any) {

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleAuth = async () => {

    setLoading(true)

    if (isLogin) {

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        alert(error.message)
        setLoading(false)
        return
      }

      alert("Login successful")

    } else {

      const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: "https://www.poiesisartgallery.com"
  }
})
      

      if (error) {
        alert(error.message)
        setLoading(false)
        return
      }

      alert("Check your email to confirm account")
      setIsLogin(true)

    }

    setLoading(false)
    setOpen(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      
  options: {
    queryParams: {
      prompt: "select_account"
    }
  }
    })
  }

  return (

    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl transform transition-all duration-300 scale-100">

        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-art text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:border-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:border-black"
          />

        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white py-2 mt-6 rounded-md hover:opacity-80"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 mt-3 rounded-md hover:bg-gray-100"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">

          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>

        </p>

      </div>

    </div>

  )

}