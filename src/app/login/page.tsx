"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

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
      router.push("/")

    } else {

      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        alert(error.message)
        setLoading(false)
        return
      }

      alert("Signup successful. Check your email.")
      setIsLogin(true)

    }

    setLoading(false)
  }

  return (

    <main className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-xl">

        {/* TITLE */}
        <h1 className="text-3xl  text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        {/* INPUTS */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-md outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-md outline-none"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white py-2 mt-6 rounded-md hover:opacity-80"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        {/* TOGGLE */}
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

    </main>

  )

}