"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function WishlistButton({
  art,
}: any) {
  const [user, setUser] = useState<any>(null)
  const [wishlisted, setWishlisted] =
    useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()

    setUser(data.user)

    if (!data.user) return

    const { data: existing } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("artwork_id", art.id)
      .single()

    if (existing) setWishlisted(true)
  }

  const handleWishlist = async () => {
    if (!user) {
      alert("Please login first")
      return
    }

    if (wishlisted) {
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("artwork_id", art.id)

      setWishlisted(false)

    } else {
      await supabase
        .from("wishlist")
        .insert({
          user_id: user.id,
          artwork_id: art.id,
        })

      setWishlisted(true)
    }
  }

  return (
    <button
      onClick={handleWishlist}
      className={`
      px-1 py-1 rounded-full border
      transition-all duration-300
      ${
        wishlisted
          ? "text-sm border-red-600 text-red-600 font-bold"
          : "text-sm border-gray-300"
      }
    `}
    >
      {wishlisted
        ? "Wishlisted"
        : "Wishlist"}
    </button>
  )
}