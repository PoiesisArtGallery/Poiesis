"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function LikeButton({
  artworkId,
}: {
  artworkId: string
}) {

  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  // UNIQUE GUEST KEY
  const userKey =
    typeof window !== "undefined"
      ? localStorage.getItem("guest_id") ||
        crypto.randomUUID()
      : ""

  useEffect(() => {

    initialize()

  }, [])

  const initialize = async () => {

    // STORE GUEST ID
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("guest_id")
    ) {
      localStorage.setItem("guest_id", userKey)
    }

    // CHECK EXISTING STATS
    let { data: stats } = await supabase
      .from("artwork_stats")
      .select("*")
      .eq("artwork_id", artworkId)
      .single()

    // IF NO STATS EXIST
    if (!stats) {

      const randomLikes =
        Math.floor(
          Math.random() * (5000 - 1000 + 1)
        ) + 1000

      // CREATE INITIAL STATS
      const { data: inserted } = await supabase
        .from("artwork_stats")
        .insert({
          artwork_id: artworkId,
          likes: randomLikes,
          comments_count: 0,
        })
        .select()
        .maybeSingle()

      stats = inserted
    }

    setLikes(stats?.likes || 0)

    // CHECK IF USER ALREADY LIKED
    const { data: existingLike } =
      await supabase
        .from("artwork_likes")
        .select("*")
        .eq("artwork_id", artworkId)
        .eq("user_key", userKey)
        .single()

    if (existingLike) {
      setLiked(true)
    }
  }

  const handleLike = async () => {

    // UNLIKE
    if (liked) {

      setLiked(false)

      setLikes((prev) => prev - 1)

      await supabase
        .from("artwork_likes")
        .delete()
        .eq("artwork_id", artworkId)
        .eq("user_key", userKey)

      await supabase
        .from("artwork_stats")
        .update({
          likes: likes - 1,
        })
        .eq("artwork_id", artworkId)

    } else {

      // LIKE
      setLiked(true)

      setLikes((prev) => prev + 1)

      await supabase
        .from("artwork_likes")
        .insert({
          artwork_id: artworkId,
          user_key: userKey,
        })

      await supabase
        .from("artwork_stats")
        .update({
          likes: likes + 1,
        })
        .eq("artwork_id", artworkId)
    }
  }

  return (

    <button
      onClick={handleLike}
      className="
        flex items-center gap-1
        transition-all duration-300
      "
    >

      <Heart
        size={20}
        className={`
          transition-all duration-300
          ${
            liked
              ? "fill-red-500 text-red-500"
              : "text-black"
          }
        `}
      />

      <span className="text-sm">

        {likes.toLocaleString()}

      </span>

    </button>

  )
}