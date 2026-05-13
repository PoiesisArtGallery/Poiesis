"use client"

import { useEffect, useState } from "react"

import { useCartStore } from "@/store/cartStore"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"
import Footer from "@/components/Footer"
import {  Menu, X, ShoppingCart, Info } from "lucide-react"
import LikeButton from "@/components/LikeButton"
import WishlistButton from "@/components/WishlistButton"
import CommentSection from "@/components/CommentSection"
import GalleryFilter from "@/components/GalleryFilter"
import { useWishlistStore } from "@/store/wishlistStore"

export default function GalleryPage() {
const [showCategories, setShowCategories] =
  useState(false)
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
const scrollToCategory = (
  category: string
) => {

  const section =
    document.getElementById(category)

  if (section) {

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  setShowCategories(false)
}
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
{/* FLOATING CATEGORY MENU */}

<div
  className="
    fixed left-3 top-3/7
    -translate-y-1/2
    z-50
  "
>

  {/* MENU BUTTON */}
  <button
    onClick={() =>
      setShowCategories(!showCategories)
    }
    className="
      bg-black/90
      backdrop-blur-md
      text-white
      p-3
      rounded-full
      shadow-2xl
      hover:scale-110
      transition-all duration-300
    "
  >

    {showCategories ? (
      <X size={15} />
    ) : (
      <Menu size={15} />
    )}

  </button>

  {/* CATEGORY PANEL */}
  <div
    className={`
      overflow-hidden
      transition-all duration-500
      ${
        showCategories
          ? "max-h-[700px] opacity-100 mt-4"
          : "max-h-0 opacity-0"
      }
    `}
  >

    <div
      className="
        bg-white/90
        backdrop-blur-xl
        shadow-2xl
        rounded-3xl
        p-4
        flex flex-col
        gap-2
        min-w-[220px]
        border
      "
    >

      {categories.map((cat) => (

        <button
          key={cat}
          onClick={() =>
            scrollToCategory(cat)
          }
          className="
            text-left
            px-4 py-2
            rounded-[15px]
            hover:bg-black
            hover:text-white
            transition-all duration-300
            font-medium
          "
        >

          {cat}

        </button>

      ))}

    </div>

  </div>

</div>
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
            className="mb-10"
          >

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

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

  

  return (

    <div className="p-2">

      <div className="group">

        <div className="overflow-hidden rounded-xl shadow-xl">

         <Link href={`/artwork/${art.id}`}>

  <img
    src={getImageUrl(art.image)}
    className="h-[250px] w-full object-cover group-hover:scale-105 transition duration-800 mb-3 cursor-pointer"
  />

</Link>
          <Link href={`/artwork/${art.id}`}>

  <p className="font-art hover:underline cursor-pointer">
    {art.title}
  </p>

</Link>
          <Link
  href={`/artists/${encodeURIComponent(
    art.artist
  )}`}
>

  <p className="text-md font-bold text-blue-800 hover:underline cursor-pointer">

    {art.artist}

  </p>

</Link>

          <Link href={`/artwork/${art.id}`}>

            <p className="text-red-800 font-bold underline text-sm border rounded-[20px] px-3 py-1 inline-block mt-2 hover:bg-yellow-400 hover:text-black transition">

              Show More

            </p>

          </Link>

          <div className="flex justify-end font-bold text-[15px] border rounded-[20px] px-1 py-1 inline-block mx-8 mt-2 hover:bg-black hover:text-white transition">

            <div className="flex justify-end mx-8 mt-2">
  <WishlistButton art={art} />
</div>
          </div>

        </div>

      </div>

      <div className="flex justify-between items-center mt-3">

       <div className="flex items-center gap-4 text-sm">

  <LikeButton artworkId={art.id} />

  <CommentSection artworkId={art.id} />

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

     

    </div>

  )
}