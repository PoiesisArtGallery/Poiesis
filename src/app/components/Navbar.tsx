"use client"

import { useEffect, useState, useRef } from "react"
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

  // Separate sticky states and refs for mobile and desktop
  const [isMobileSticky, setIsMobileSticky] = useState(false)
  const [isDesktopSticky, setIsDesktopSticky] = useState(false)
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const desktopNavRef = useRef<HTMLDivElement>(null)

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

  // 🛠️ JS Scroll Logic: Monitors scrolling for both Desktop and Mobile views
  useEffect(() => {
  const MOBILE_TRIGGER = 120
  const DESKTOP_TRIGGER = 120

  const handleScroll = () => {
    const scrollY = window.scrollY

    // Mobile Sticky
    if (scrollY > MOBILE_TRIGGER) {
      setIsMobileSticky(true)
    } else {
      setIsMobileSticky(false)
    }

    // Desktop Sticky
    if (scrollY > DESKTOP_TRIGGER) {
      setIsDesktopSticky(true)
    } else {
      setIsDesktopSticky(false)
    }
  }

  window.addEventListener("scroll", handleScroll)

  return () => {
    window.removeEventListener("scroll", handleScroll)
  }
}, [])

  return (
    <div className="w-full bg-white flex flex-col">
      {/* Offer Banner - Scrolls away naturally */}
      <div className="text-center font-accent font-bold text-md bg-[#fff3b1] text-violet-700 py-2">
        "Step into a world where every piece tells a story, and every story finds a home"
      </div>

      {/* 🔥 MOBILE NAV */}
      <div className="flex flex-col md:hidden items-center py-1">
        {/* ✅ LOGO ALWAYS TOP - Scrolls away on mobile */}
        <Link href="/">
          <img
            src="/logo.jpeg"
            alt="logo"
            className="h-10 mb-2"
          />
        </Link>

        {/* Dynamic spacer prevents content jumping when sticky activates */}
        {isMobileSticky && <div className="h-[140px] md:hidden"></div>}

        {/* ✅ MOBILE STICKY WRAPPER */}
        <div 
          ref={mobileNavRef}
          className={
            isMobileSticky 
              ? "fixed top-0 left-0 w-full z-50 border-b bg-white shadow-sm flex flex-col items-center" 
              : "relative w-full bg-white flex flex-col items-center"
          }
        >
          {/* Main Navigation */}
          <div className="flex items-center justify-between px-2 sm:px-4 md:px-10 py-3 overflow-hidden">
            {/* Navigation */}
            <nav className="flex gap-4 text-sm items-center flex-wrap text-black">
              <a href="/" className="flex items-center gap-1 font-bold hover:text-red-700 hover:underline">
                <Home size={18} />
                Home
              </a>
              <a href="/gallery" className="hover:text-red-700 hover:underline font-bold transition">
                Gallery
              </a>
              <a href="/artists" className="hover:text-red-700 font-bold hover:underline transition">
                Artists
              </a>
              <a href="/exhibitions" className="hover:text-red-700 hover:underline font-bold transition">
                Exhibitions
              </a>
              <a href="/press" className="hover:text-red-700 hover:underline font-bold transition">
                Press
              </a>
            </nav>
          </div>

          {/* Icons */}
          <div className="flex items-center justify-between px-4 py-2 flex-wrap gap-2 text-black w-full max-w-md">
            <SearchBar />
            <LoginModal open={isLoginModalOpen} setOpen={setIsLoginModalOpen} />

            {user ? (
              <div className="relative">
                <div onClick={() => setOpenMenu(!openMenu)} className="flex items-center gap-2 cursor-pointer">
                  <img src={user.user_metadata?.avatar_url || "/default.png"} className="w-8 h-8 rounded-full" />
                  <span className="text-lg md:block hover:text-red-700 hover:underline font-bold">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                {openMenu && (
                  <div className="absolute right-0 mx-8 mt-2 bg-white border shadow-md rounded-lg w-30 text-left z-50">
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
                  className="text-right mr-50 px-4 py-2 hover:bg-gray-100 mt-2 bg-white border shadow-md rounded-lg w-23"
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

            <a href="/cart" className="border px-3 py-1 flex items-center gap-1 rounded-[10px] hover:bg-black hover:text-white transition">
              <ShoppingCartIcon size={18} /> [{items.length}]
            </a>
          </div>
        </div>
      </div>

      {/* 🔥 DESKTOP NAV */}
      <div className="hidden md:block h-[60px]"></div>

      <div 
        ref={desktopNavRef}
       className={`
  hidden md:flex items-center justify-between
  px-6 py-1 border-b bg-white
  transition-all duration-300
  ${
    isDesktopSticky
      ? "fixed top-0 left-0 w-full z-50 shadow-md backdrop-blur-md"
      : "relative"
  }
`}
      >
        {/* Logo */}
        <a href="/" className="flex items-center ">
          <Image
            src="/logo.jpeg"
            alt="Poiesis Art Gallery"
            width={100}
            height={30}
            priority
          />
        </a>

        {/* Main Navigation */}
        <div className="flex items-center justify-between px-2 sm:px-6 md:px-10 py-1 overflow-hidden">
          {/* Navigation */}
          <nav className="flex gap-6 text-sm items-center flex-wrap text-black">
            <a href="/" className="flex items-center gap-1 font-bold hover:text-red-700 hover:underline">
              <Home size={18} />
              Home
            </a>
            <a href="/gallery" className="hover:text-red-700 hover:underline font-bold transition">
              Gallery
            </a>
            <a href="/artists" className="hover:text-red-700 font-bold hover:underline transition">
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
        <div className="flex items-center justify-between px-6 py-1 flex-wrap gap-2 text-black">
          <SearchBar />
          <LoginModal open={isLoginModalOpen} setOpen={setIsLoginModalOpen} />

          {user ? (
            <div className="relative">
              <div onClick={() => setOpenMenu(!openMenu)} className="flex items-center gap-2 cursor-pointer">
                <img src={user.user_metadata?.avatar_url || "/default.png"} className="w-8 h-8 rounded-full" />
                <span className="text-lg md:block hover:text-red-700 hover:underline font-bold">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              {openMenu && (
                <div className="absolute right-0 mx-8 mt-2 bg-white border shadow-md rounded-lg w-30 text-left z-50">
                  <a href="/dashboard" className="block px-4 py-1 hover:bg-gray-100">
                    Dashboard
                  </a>
                </div>
              )}
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.reload()
                }}
                className="text-right mr-50 px-4 py-1 hover:bg-gray-100 mt-2 bg-white border shadow-md rounded-lg w-23"
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

          <a href="/cart" className="border px-3 py-1 flex items-center gap-1 rounded-[10px] hover:bg-black hover:text-white transition">
            <ShoppingCartIcon size={18} /> [{items.length}]
          </a>
        </div>
      </div>
    </div>
  )
}
