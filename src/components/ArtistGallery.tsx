"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"

export default function ArtistGallery() {

  const [artworks, setArtworks] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [artist, setArtist] = useState("")
  const [artists, setArtists] = useState<string[]>([])
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {

    const fetch = async () => {

      const { data } = await supabase
        .from("artworks")
        .select("*")

      setArtworks(data || [])

      const uniqueArtists = [
        ...new Set(data?.map(a => a.artist))
      ]

      setArtists(uniqueArtists)
    }

    fetch()

  }, [])

  const filtered = artist
    ? artworks.filter(a => a.artist === artist)
    : artworks

  return (

    <section className="px-6 md:px-12 py-16">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl md:text-3xl font-heading mb-10 text-center underline">Explore by Artist</h2>
 {artist && (
    <span className="text-2xl font-heading text-blue-800 underline">
       {artist}
    </span>
  )}
        <button onClick={() => setShowSearch(!showSearch)}>
          🔍
        </button>

      </div>

      {showSearch && (
        <div className="mb-4">

          {artists.map((a, i) => (
            <div
              key={i}
              onClick={() => {
                setArtist(a)
                setVisibleCount(6)
                setShowSearch(false)
              }}
              className="cursor-pointer hover:bg-gray-100 px-2 py-1"
            >
              {a}
            </div>
          ))}

        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        {filtered.slice(0, visibleCount).map((art) => (

          <Link key={art.id} href={`/artwork/${art.id}`}>

            <img
              src={getImageUrl(art.image)}
              className="h-[250px] w-full object-contain rounded-[15px] mb-3"
            />

            <p className="text-lg font-art underline">{art.title}</p>

          </Link>

        ))}

      </div>

      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount(prev => prev + 6)}
          className="font-bold text-blue-900 mt-6 border rounded-[20px] px-2 hover:bg-yellow-400 hover:text-black transition"
        >
          Show More
        </button>
      )}

    </section>
  )
}