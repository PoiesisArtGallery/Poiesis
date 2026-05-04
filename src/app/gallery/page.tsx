"use client"

import { useEffect, useState } from "react"
// ❌ removed static import
// import { artworks } from "@/data/artworks"

import { useCartStore } from "@/store/cartStore"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"
import Footer from "@/components/Footer"
import { Heart, MessageCircle, ShoppingCart, Info } from "lucide-react"
import GalleryFilter from "@/components/GalleryFilter"
import { useWishlistStore } from "@/store/wishlistStore"

export default function GalleryPage() {

  const addToCart = useCartStore((state) => state.addToCart)

  // ✅ NEW STATE (CRITICAL FIX)
  const [artworks, setArtworks] = useState<any[]>([])

  // ✅ FETCH FROM SUPABASE
  useEffect(() => {

    const fetchArtworks = async () => {

      const { data, error } = await supabase
        .from("artworks")
        .select("*")

      console.log("FETCHED:", data, error)

      if (error) {
        console.error(error)
        return
      }

      setArtworks(data || [])
    }

    fetchArtworks()

  }, [])

  const isPurchasable = (art: any) => {
  return !(
    art.category === "Murals" ||
    art.category === "Commission" ||
    art.status === "Out of Stock" ||
    art.status === "Exhibition Only"
  )
}

  const categories = [
    "Paintings",
    "Landscape",
    "Sketch",
    "Murals",
    "Sculpture",
    "Snapshots",
    "Graphics & Printmaking"
    
  ]

  return (

    <main className="px-6 bg-[#ffefe4] md:px-10 py-10">

      <h1 className="font-art text-center text-[60px] underline font-bold">Gallery</h1>

      <GalleryFilter categories={categories} />

      {categories.map((category) => {

        // ✅ USE SUPABASE DATA
        const filtered = artworks.filter(
          (art) => art.category === category
        )

        if (filtered.length === 0) return null

        return (

          <section id={category} key={category} className="mb-20">

            <h2 className="text-4xl font-heading font-bold underline mb-6">
              {category}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

              {filtered.map((art) => (
                <ArtworkCard
                  key={art.id}
                  art={art}
                  addToCart={addToCart}
                  isPurchasable={isPurchasable}
                />
              ))}

            </div>

          </section>

        )

      })}


    </main>

  )
}

// 🔥 COMPONENT (UNCHANGED LOGIC)

function ArtworkCard({ art, addToCart, isPurchasable }: any) {

  const [likes, setLikes] = useState<number>(art.likes || 0)
  const [comments, setComments] = useState<any[]>([])
  const [baseComments] = useState<number>(art.commentsCount || 0)
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)
  const [commented, setCommented] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {

    const likedKey = `liked-${art.id}`
    const commentKey = `commented-${art.id}`

    if (localStorage.getItem(likedKey)) setLiked(true)
    if (localStorage.getItem(commentKey)) setCommented(true)

    const fetchData = async () => {

      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .eq("artwork_id", art.id)

      setComments(commentsData || [])

      if (userData.user) {
        const { data: existing } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", userData.user.id)
          .eq("artwork_id", art.id)
          .single()

        if (existing) setIsWishlisted(true)
      }

    }

    fetchData()

  }, [art.id])

  const handleWishlist = async () => {

    if (!user) {
      alert("Please login first")
      return
    }

    if (isWishlisted) {

      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("artwork_id", art.id)

      setIsWishlisted(false)

    } else {

      await supabase
        .from("wishlist")
        .insert([{
          user_id: user.id,
          artwork_id: art.id,
          title: art.title,
          image: art.image,
          price: art.price
        }])

      setIsWishlisted(true)

    }
  }

  const handleLike = async () => {

    const key = `liked-${art.id}`

    if (liked) {
      setLikes((prev) => prev - 1)
      setLiked(false)
      localStorage.removeItem(key)
    } else {
      setLikes((prev) => prev + 1)
      setLiked(true)
      localStorage.setItem(key, "true")

      await supabase.from("likes").insert([
        { artwork_id: art.id }
      ])
    }
  }

  const handleComment = async () => {

    if (!newComment.trim() || commented) {
      alert("You can comment only once")
      return
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([{
        artwork_id: art.id,
        name: "Anonymous",
        comment: newComment
      }])
      .select()

    if (error) {
      console.error(error)
      return
    }

    setComments((prev) => [...prev, ...(data || [])])
    setNewComment("")
    setCommented(true)

    localStorage.setItem(`commented-${art.id}`, "true")
  }

  return (

    <div className="p-4">

      <div className="group">

        <div className="overflow-hidden rounded-xl shadow-xl">

          <img
            src={getImageUrl(art.image)}
            className="h-[250px] w-full object-contain group-hover:scale-105 transition duration-800 mb-3"
          />

          <p className="font-art">{art.title}</p>
          <p className="text-md font-bold text-blue-800">{art.artist}</p>

          

<Link 
href={`/artwork/${art.id}`}>
  <p className="text-red-800 font-bold underline text-sm border rounded-[20px] px-3 py-1 inline-block mt-2 hover:bg-yellow-400 hover:text-black transition">
             
  Show More </p>
</Link>
<div className="flex justify-end font-bold text-[15px]  border rounded-[20px] px-1 py-1 inline-block mx-8 mt-2 hover:bg-black hover:text-white transition">
          <button onClick={handleWishlist}>
            {isWishlisted ? "❤️" : "🤍"} Wishlist
          </button>

        </div>
</div>
      </div>

      <div className="flex justify-between items-center mt-3">

        <div className="flex items-center gap-4 text-sm">

          <button onClick={handleLike}>
            <Heart size={20} /> {likes}
          </button>

          <button onClick={() => setShowComments(!showComments)}>
            <MessageCircle size={20} /> {baseComments + comments.length}
          </button>

        </div>

        {isPurchasable(art) ? (
          <button onClick={() =>
            addToCart({
              id: art.id,
              title: art.title,
              price: art.price,
              image: art.image,
              category: art.category
            })
          }>
            <ShoppingCart size={20} />
          </button>
        ) : (
          <Link href="/inquiry">
            <Info size={20} />
          </Link>
        )}

      </div>

      {showComments && (

        <div className="mt-3">

          <div className="flex gap-2">

            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="border p-1 text-sm flex-1"
            />

            <button onClick={handleComment} className="text-sm border px-2">
              Post
            </button>

          </div>

          <div className="mt-2 text-sm space-y-1">

            {comments.map((c) => (
              <p key={c.id}>
                <strong>{c.name}:</strong> {c.comment}
              </p>
            ))}

          </div>

        </div>

      )}

    </div>

  )
}