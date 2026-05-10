"use client"

import { useEffect, useState } from "react"

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

  // ✅ FETCHED ARTWORKS
  const [artworks, setArtworks] = useState<any[]>([])

  // ✅ NEW STATES
  const [visibleCounts, setVisibleCounts] = useState<any>({})
  const [shuffledData, setShuffledData] = useState<any>({})
const [user, setUser] = useState<any>(null)
useEffect(() => {

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  fetchUser()

}, [])
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
    "Landscapes",
    "Sketch",
    "Murals",
    "Sculpture",
    "Snapshots",
    "Graphics / Printmaking"

  ]

  // ✅ SHUFFLE ARRAY
  const shuffleArray = (array: any[]) => {

    const arr = [...array]

    for (let i = arr.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1))

      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr
  }

  // ✅ BALANCED DISPLAY
  const getBalancedArtworks = (arts: any[]) => {

    const grouped: any = {}

    arts.forEach((art: any) => {

      if (!grouped[art.artist]) {
        grouped[art.artist] = []
      }

      grouped[art.artist].push(art)
    })

    // ✅ SHUFFLE EACH ARTIST
    Object.keys(grouped).forEach((artist: any) => {

      grouped[artist] = shuffleArray(grouped[artist])
    })

    const result: any[] = []

    // ✅ TAKE 1 FROM EACH ARTIST
    Object.keys(grouped).forEach((artist) => {

      if (grouped[artist].length > 0) {

        result.push(grouped[artist].shift())
      }
    })

    // ✅ REMAINING RANDOM
    const remaining = Object.values(grouped).flat()

    const shuffledRemaining = shuffleArray(remaining)

    return [...result, ...shuffledRemaining]
  }

  // ✅ SHOW MORE
  const handleShowMore = (category: string) => {

    setVisibleCounts((prev: any) => ({

      ...prev,

      [category]: (prev[category] || 10) + 10
    }))
  }

  // ✅ SHUFFLE CATEGORY
  const handleShuffle = (category: string, arts: any[]) => {

    const balanced = getBalancedArtworks(arts)

    setShuffledData((prev: any) => ({

      ...prev,

      [category]: balanced
    }))
  }

  return (

    <main className="px-2 bg-[#ffefe4] md:px-10 py-10">

      <h1 className="font-art text-center text-[60px] underline font-bold">
        Gallery
      </h1>

      <GalleryFilter categories={categories} />

      {categories.map((category) => {

       const categoryArts = artworks.filter(
  (art: any) => art.category === category
)

        if (categoryArts.length === 0) return null

        // ✅ BALANCED INITIAL DATA
        const balancedArtworks =
          shuffledData[category] ||
          getBalancedArtworks(categoryArts)

        const visible = visibleCounts[category] || 10

        const visibleArtworks =
          balancedArtworks.slice(0, visible)

        return (

          <section
            id={category}
            key={category}
            className="mb-20"
          >

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

              <h2 className="text-4xl font-heading font-bold underline">
                {category}
              </h2>

              {/* ACTIONS */}
              <div className="flex gap-3">

                
{user?.email === "poiesis.art.gallery.pag@gmail.com" && (
  <button
                  onClick={() =>
                    handleShuffle(category, categoryArts)
                  }
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                >
                  Shuffle
                </button>
)}
               

              </div>

            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

              {visibleArtworks.map((art: any) => (

                <ArtworkCard
                  key={art.id}
                  art={art}
                  addToCart={addToCart}
                  isPurchasable={isPurchasable}
                />

              ))}

            </div>
 <button
                  onClick={() =>
                    handleShowMore(category)
                  }
                  className="bg-yellow-500 text-red-800 font-semibold px-4 py-2 rounded-[15px] hover:bg-yellow-500 transition"
                >
                  Show More Artworks
                </button>
          </section>

        )

      })}

    </main>
  )
}

// 🔥 ARTWORK CARD

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

    localStorage.setItem(
      `commented-${art.id}`,
      "true"
    )
  }

  return (

    <div className="p-2">

      <div className="group">

        <div className="overflow-hidden rounded-xl shadow-xl">

          <img
            src={getImageUrl(art.image)}
            className="h-[250px] w-full object-cover group-hover:scale-105 transition duration-800 mb-3"
          />

          <p className="font-art">{art.title}</p>

          <p className="text-md font-bold text-blue-800">
            {art.artist}
          </p>

          <Link href={`/artwork/${art.id}`}>

            <p className="text-red-800 font-bold underline text-sm border rounded-[20px] px-3 py-1 inline-block mt-2 hover:bg-yellow-400 hover:text-black transition">

              Show More

            </p>

          </Link>

          <div className="flex justify-end font-bold text-[15px] border rounded-[20px] px-1 py-1 inline-block mx-8 mt-2 hover:bg-black hover:text-white transition">

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

          <button
            onClick={() =>
              setShowComments(!showComments)
            }
          >
            <MessageCircle size={20} />{" "}
            {baseComments + comments.length}
          </button>

        </div>

        {isPurchasable(art) ? (

          <button
            onClick={() =>
              addToCart({
                id: art.id,
                title: art.title,
                price: art.price,
                image: art.image,
                category: art.category
              })
            }
          >
            <ShoppingCart size={20} />
          </button>

        ) : (

          <Link
            href={`/inquiry?artwork=${encodeURIComponent(
              art.title
            )}&artist=${encodeURIComponent(
              art.artist
            )}`}
          >
            <Info size={20} />
          </Link>

        )}

      </div>

      {showComments && (

        <div className="mt-3">

          <div className="flex gap-2">

            <input
              value={newComment}
              onChange={(e) =>
                setNewComment(e.target.value)
              }
              placeholder="Write a comment..."
              className="border p-1 text-sm flex-1"
            />

            <button
              onClick={handleComment}
              className="text-sm border px-2"
            >
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