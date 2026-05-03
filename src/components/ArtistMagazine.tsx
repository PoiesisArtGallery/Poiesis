"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import{ getImageUrl } from "@/lib/getImage"
export default function ArtistMagazine() {

  const [artists, setArtists] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)

  // 🔥 FETCH FEATURED ARTISTS FROM SUPABASE
  useEffect(() => {

    const fetchArtists = async () => {

      const { data } = await supabase
        .from("artists")
        .select("*")
        .eq("featured", true)

      setArtists(data || [])
    }

    fetchArtists()

  }, [])

  // ⛔ prevent crash before data loads
  if (artists.length === 0) return null

  const artist = artists[index]

  const nextPage = () => {
    setFlipping(true)

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % artists.length)
      setFlipping(false)
    }, 400)
  }

  return (

    <section className="bg-[#eaeaea] px-6 md:px-12 py-24">

      <h2 className="text-4xl font-heading text-center mb-6 underline decoration-[#000050] decoration-4">
        Artist Spotlight
      </h2>

      {/* 📖 BOOK CONTAINER */}
      <div className="max-w-6xl mx-auto perspective">

        <div
          className={`
            relative bg-white rounded-lg shadow-2xl overflow-hidden
            grid md:grid-cols-2
            transition-transform duration-500
            ${flipping ? "rotate-y-6 scale-[0.98]" : ""}
          `}
        >

          {/* LEFT PAGE */}
          <div className="relative h-[550px] w-[300px] bg-gray-100">

            <Image
              src={getImageUrl(artist.image, "artists")}
              alt={artist.name}
              fill
              className="object-cover rounded-[40px]"
            />

          </div>

          {/* RIGHT PAGE */}
          <div className="flex flex-col justify-center p-1 md:p-10">

            <p className="text-lg text-blue-700 mb-1 font-art">
              Featured Artist
            </p>

            <h3 className="text-3xl font-heading mb-1">
              {artist.name}
            </h3>

            <p className="text-gray-700 leading-relaxed mb-1">
              {artist.short_bio || artist.shortBio}
            </p>

            <Link
              href={`/artists/${artist.slug}`}
              className="font-bold text-sm border rounded-[20px] px-3 py-1 w-fit hover:bg-black hover:text-white transition"
            >
              Show More →
            </Link>
{/* 📄 CONTROLS */}
      <div className="text-right  mx-13 mt-1 space-y-2">

        <p className="text-xs font-bold text-red-800">
          {String(index + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}
        </p>

        <button
          onClick={nextPage}
          className="font-bold text-sm text-center  border rounded-[50px] px-3 py-1 hover:bg-black hover:text-white transition"
        >
          Next Page →
        </button>

      </div>
          </div>
 
        </div>

      </div>

     

    </section>

  )

}