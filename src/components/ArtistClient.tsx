"use client"

import { useState } from "react"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"
import Footer from "./Footer"
export default function ArtistClient({ artist, artworks }: any) {

  const [showFullBio, setShowFullBio] = useState(false)

  // ✅ FIXED FIELD MAPPING
  const shortBio = artist.short_bio || artist.shortBio || ""
  const fullBio = artist.full_bio || artist.fullBio || ""

  // ✅ SAFE ARRAYS
  const exhibitions = Array.isArray(artist.exhibitions)
    ? artist.exhibitions
    : []

  const press = Array.isArray(artist.press)
    ? artist.press
    : []

  return (

    <main className="px-10 py-16">

      {/* Artist Header */}

      <div className="grid md:grid-cols-2 gap-16 mb-20">

        <img
  src={getImageUrl(artist.image, "artists")}
  className="h-[420px] object-cover rounded-[25px]"
/>

        <div>

          <h1 className="text-4xl font-heading underline mb-6">
            {artist.name}
          </h1>

          <p className="mb-4 text-gray-700 font-medium">
            {shortBio}
          </p>

          {showFullBio && (
            <p className="mb-4">
              {fullBio}
            </p>
          )}

          {!showFullBio ? (

            <button
              onClick={() => setShowFullBio(true)}
              className="text-sm font-bold text-blue-600 border rounded-[20px] px-3 py-1"
            >
              Show More Details
            </button>

          ) : (

            <button
              onClick={() => setShowFullBio(false)}
              className="text-sm font-bold text-blue-600 border rounded-[20px] px-3 py-1"
            >
              Show Less
            </button>

          )}

        </div>

      </div>


      {/* Artworks */}

      <section className="mb-20">

        <h2 className="text-3xl font-heading underline mb-10">
          Artworks
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {artworks?.map((art: any) => (

           <Link
  key={art.id}
  href={`/artwork/${art.id}`}
  className="block"
>

              <img
  src={getImageUrl(art.image, "artworks")}
  className="h-[350px] w-full object-cover rounded-[20px] mb-3"
/>

              <p className="font-art">
                {art.title}
              </p>
<span className="text-sm underline font-bold text-blue-600 border rounded-[20px] px-3 py-1 inline-block hover:bg-black hover:text-white transition">
  Show More
</span>

            </Link>

          ))}

        </div>

      </section>


      {/* Exhibitions */}

      {exhibitions.length > 0 && (

        <section className="mb-20">

          <h2 className="text-3xl font-light mb-6">
            Exhibitions
          </h2>

          <ul className="space-y-2">

            {exhibitions.map((ex: string, i: number) => (
              <li key={i}>{ex}</li>
            ))}

          </ul>

        </section>

      )}


      {/* Press */}

      {press.length > 0 && (

        <section>

          <h2 className="text-3xl font-light mb-6">
            Press Mentions
          </h2>

          <ul className="space-y-2">

            {press.map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}

          </ul>

        </section>

      )}
     
    </main>

  )
}