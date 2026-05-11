"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"
import { ShoppingCart, Info } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

export default function Dashboard() {

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const addToCart = useCartStore(
    (state) => state.addToCart
  )

  useEffect(() => {

    const loadWishlist = async () => {

      const { data: userData } =
        await supabase.auth.getUser()

      if (!userData.user) {
        setLoading(false)
        return
      }

      // FETCH WISHLIST IDS
      const { data: wishlist } = await supabase
        .from("wishlist")
        .select("artwork_id")
        .eq("user_id", userData.user.id)

      if (!wishlist || wishlist.length === 0) {
        setItems([])
        setLoading(false)
        return
      }

      const artworkIds = wishlist.map(
        (w) => w.artwork_id
      )

      // FETCH REAL ARTWORKS
      const { data: artworks } = await supabase
        .from("artworks")
        .select("*")
        .in("id", artworkIds)

      setItems(artworks || [])

      setLoading(false)
    }

    loadWishlist()

  }, [])

  const isPurchasable = (art: any) => {

    return !(

      art.category === "Murals" ||
      art.category === "Commission" ||
      art.status === "Out of Stock" ||
      art.status === "Exhibition Only"

    )
  }

  if (loading) {

    return (

      <main className="px-6 md:px-12 py-16">

        <p>Loading wishlist...</p>

      </main>

    )
  }

  return (

    <main className="px-6 md:px-12 py-16 min-h-screen bg-[#ffefe4]">

      <h1 className="text-4xl font-art mb-10">

        Your Wishlist

      </h1>

      {items.length === 0 ? (

        <p className="text-gray-500">

          No items in wishlist

        </p>

      ) : (

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {items.map((art) => (

            <div key={art.id} className="group">

              {/* IMAGE */}
              <div className="overflow-hidden rounded-xl shadow-xl">

                <img
                  src={getImageUrl(art.image)}
                  alt={art.title}
                  className="
                    h-[250px]
                    w-full
                    object-cover
                    group-hover:scale-105
                    transition
                    duration-500
                  "
                />

              </div>

              {/* INFO */}
              <div className="mt-3">

                <p className="font-art">

                  {art.title}

                </p>

                <p className="text-md font-bold text-blue-800">

                  {art.artist}

                </p>

                {art.price && (

                  <p className="text-sm text-gray-700 mt-1">

                    ₹{art.price}

                  </p>

                )}

                {/* ACTIONS */}
                <div className="flex items-center gap-3 mt-3">

                  <Link
                    href={`/artwork/${art.id}`}
                    className="
                      text-red-800
                      font-bold
                      underline
                      text-sm
                      border
                      rounded-[20px]
                      px-3
                      py-1
                      hover:bg-yellow-400
                      hover:text-black
                      transition
                    "
                  >
                    Show More
                  </Link>

                  {isPurchasable(art) ? (

                    <button
                      onClick={() =>
                        addToCart({
                          id: art.id,
                          title: art.title,
                          price: art.price,
                          image: art.image,
                          category: art.category,
                        })
                      }
                      className="
                        border
                        rounded-full
                        p-2
                        hover:bg-black
                        hover:text-white
                        transition
                      "
                    >
                      <ShoppingCart size={18} />
                    </button>

                  ) : (

                    <Link
                      href={`/inquiry?artwork=${encodeURIComponent(
                        art.title
                      )}&artist=${encodeURIComponent(
                        art.artist
                      )}`}
                      className="
                        border
                        rounded-full
                        p-2
                        hover:bg-black
                        hover:text-white
                        transition
                      "
                    >
                      <Info size={18} />
                    </Link>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>

  )

}