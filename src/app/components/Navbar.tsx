"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import SearchBar from "@/components/SearchBar"
import { useCartStore } from "@/store/cartStore"
import Image from "next/image"
import Link from "next/link"
import { useWishlistStore } from "@/store/wishlistStore"
import LoginModal from "@/components/LoginModal"
import { Home, ShoppingCartIcon } from "lucide-react"
export default function Navbar() {
  const items = useCartStore((state) => state.items)
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
 const [openLogin, setOpenLogin] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const handleLogout = async () => {
  await supabase.auth.signOut()
  window.location.reload()
 
}
useEffect(() => {

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
    
  }

  getUser()

}, [])

useEffect(() => {

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user || null)
    }
  )

  return () => {
    listener.subscription.unsubscribe()
  }

}, [])
useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user)
  })
}, [])
 
  return (
    
    <header className="border-b bg-white">

      {/* Offer Banner */}
      <div className="text-center font-accent font-bold text-md bg-[#fff3b1] text-violet-700 py-2">
        "Step into a world where every piece tells a story, and every story finds a home"
      </div>
 {/* 🔥 MOBILE NAV */}
      <div className="flex flex-col md:hidden items-center py-3">

        {/* ✅ LOGO ALWAYS TOP */}
        <Link href="/">
          <img
            src="/logo.jpeg"
            alt="logo"
            className="h-10 mb-2"
          />
        </Link>
      {/* Main Navigation */}
      <div className="flex items-center justify-between px-2 sm:px-6 md:px-10 py-6 overflow-hidden">

       
 
        {/* Navigation */}
        <nav className="flex gap-6 text-sm items-center flex-wrap text-black">
  <a href="/" className="flex items-center gap-1 font-bold hover:text-red-700 hover:underline">
    <Home size={18} />
    Home
  </a>

  <a href="/gallery" className="hover:text-red-700 hover:underline font-bold transition">
    Gallery
  </a>

  <a
  href="/artists"
  className="hover:text-red-700 font-bold hover:underline transition"
>
  Artists
</a>

  <a href="/exhibitions" className="hover:text-red-700 hover:underline font-bold transition">
    Exhibitions & Events
  </a>
    

  

  <a href="/press" className="hover:text-red-700 hover:underline font-bold transition">
    Press
  </a>
   

</nav>
</div>
{/* Icons */}
        <div className="flex items-center  justify-between px-6 py-4 flex-wrap gap-2 text-black">
<SearchBar />

<LoginModal open={isLoginModalOpen} setOpen={setIsLoginModalOpen} />


  {user ? (

    <div className="relative">

      <div
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center gap-2 cursor-pointer"
      >

        <img
          src={user.user_metadata?.avatar_url || "/default.png"}
          className="w-8 h-8 rounded-full"
        />

        <span className="text-lg  md:block hover:text-red-700 hover:underline font-bold">
          {user.user_metadata?.full_name || user.email}
        </span>

      </div>

      {openMenu && (

        <div className="absolute right-0 mx-8 mt-2 bg-white border shadow-md rounded-lg w-30 text-left">

          <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
            Dashboard
          </a>

          

        </div>

      )}
<button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.reload()
            }}
            
            className=" text-right mr-50 px-4 py-2 hover:bg-gray-100 mt-2 bg-white border shadow-md rounded-lg w-23 "
          >
            Logout
          </button>
    </div>

  ) : (

    <button
      onClick={() => setOpenLogin(true)}
      className="border rounded-[10px] px-2 py-1 cursor-pointer hover:bg-black hover:text-white transition font-bold"
    >
      Login
    </button>

  )}
<LoginModal open={openLogin} setOpen={setOpenLogin} />

  <a
  href="/cart"
  className="border px-3 py-1 flex items-center gap-1 rounded-[10px] hover:bg-black hover:text-white transition"
>
  <ShoppingCartIcon size={18} /> [{items.length}]
  
</a>

</div>

</div>
{/* 🔥 DESKTOP NAV (UNCHANGED STYLE) */}
      <div className="hidden md:flex items-center justify-between px-10 py-4">
         {/* Logo */}
        <a href="/" className="flex items-center ">
  <Image
    src="/logo.jpeg"
    alt="Poiesis Art Gallery"
    width={160}
    height={40}
    priority
  />
  </a>
   {/* Main Navigation */}
      <div className="flex items-center justify-between px-2 sm:px-6 md:px-10 py-6 overflow-hidden">

       
 
        {/* Navigation */}
        <nav className="flex gap-6 text-sm items-center flex-wrap text-black">
  <a href="/" className="flex items-center gap-1 font-bold hover:text-red-700 hover:underline">
    <Home size={18} />
    Home
  </a>

  <a href="/gallery" className="hover:text-red-700 hover:underline font-bold transition">
    Gallery
  </a>

  <a
  href="/artists"
  className="hover:text-red-700 font-bold hover:underline transition"
>
  Artists
</a>

  <a href="/exhibitions" className="hover:text-red-700 hover:underline font-bold transition">
    Exhibitions & Events
  </a>
    

  

  <a href="/press" className="hover:text-red-700 hover:underline font-bold transition">
    Press
  </a>
   

</nav>
</div>
        {/* Icons */}
        <div className="flex items-center  justify-between px-6 py-4 flex-wrap gap-2 text-black">
<SearchBar />

<LoginModal open={isLoginModalOpen} setOpen={setIsLoginModalOpen} />


  {user ? (

    <div className="relative">

      <div
        onClick={() => setOpenMenu(!openMenu)}
        className="flex items-center gap-2 cursor-pointer"
      >

        <img
          src={user.user_metadata?.avatar_url || "/default.png"}
          className="w-8 h-8 rounded-full"
        />

        <span className="text-lg  md:block hover:text-red-700 hover:underline font-bold">
          {user.user_metadata?.full_name || user.email}
        </span>

      </div>

      {openMenu && (

        <div className="absolute right-0 mx-8 mt-2 bg-white border shadow-md rounded-lg w-30 text-left">

          <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
            Dashboard
          </a>

          

        </div>

      )}
<button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.reload()
            }}
            
            className=" text-right mr-50 px-4 py-2 hover:bg-gray-100 mt-2 bg-white border shadow-md rounded-lg w-23 "
          >
            Logout
          </button>
    </div>

  ) : (

    <button
      onClick={() => setOpenLogin(true)}
      className="border rounded-[10px] px-2 py-1 cursor-pointer hover:bg-black hover:text-white transition font-bold"
    >
      Login
    </button>

  )}
<LoginModal open={openLogin} setOpen={setOpenLogin} />

  <a
  href="/cart"
  className="border px-3 py-1 flex items-center gap-1 rounded-[10px] hover:bg-black hover:text-white transition"
>
  <ShoppingCartIcon size={18} /> [{items.length}]
  
</a>

</div>

      </div>
    </header>
  )
}