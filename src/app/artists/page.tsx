"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Footer from "@/components/Footer"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"
export default function ArtistsPage() {

  const [artists, setArtists] = useState<any[]>([])

  useEffect(() => {

    const fetchArtists = async () => {

      const { data, error } = await supabase
        .from("artists")
        .select("*")

      console.log("ARTISTS:", data, error)

      if (error) {
        console.error(error)
        return
      }

      setArtists(data || [])
    }

    fetchArtists()

  }, [])

  return (

    <main className="px-10 py-16">

      <h1 className="font-art text-center text-[60px] underline font-bold mb-10">
        Artists
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

        {artists.map((artist) => (

          <div key={artist.slug} className="group">

            <div className="overflow-hidden rounded-2xl shadow-xl">

              <img
                src={getImageUrl(artist.image, "artists")}
                className="aspect-auto w-[350px] object-cover group-hover:scale-105 transition duration-800 mb-3"
              />

              <h2 className="font-art text-3xl  mb-2 text-center">
                {artist.name}
              </h2>

              

<Link
  href={`/artists/${encodeURIComponent(
    artist.name
  )}`}
>
  <p className="text-sm mb-2 text-center text-blue-800 font-bold border rounded-[30px] px-4 py-1 w-max mx-auto">
    Show More
  </p>
</Link>

            </div>

          </div>

        ))}

      </div>

    

    </main>

  )
}