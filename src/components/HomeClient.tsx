"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import HeroSlider from "@/components/HeroSlider"
import { getImageUrl } from "@/lib/getImage"
import "./globals.css";
export default function HomeClient() {

  const [sections, setSections] = useState<any[]>([])
  const [artworks, setArtworks] = useState<any[]>([])
  const [artists, setArtists] = useState<any[]>([])

  useEffect(() => {

    const fetchData = async () => {

      const { data: sec } = await supabase
        .from("homepage_sections")
        .select("*")

      const { data: arts } = await supabase
        .from("artworks")
        .select("*")

      const { data: artst } = await supabase
        .from("artists")
        .select("*")
        .eq("featured", true)

      setSections(sec || [])
      setArtworks(arts || [])
      setArtists(artst || [])
    }

    fetchData()

  }, [])

  return (

    <main>

      {/* 🔥 SLIDER */}
      <HeroSlider />

      {/* 🔥 DYNAMIC SECTIONS */}
      <div className="px-6 md:px-12 py-16">

        {sections.map((section) => {

          const filtered = artworks.filter((art) =>
            section.artworks?.includes(art.title)
          )

          if (filtered.length === 0) return null

          return (

            <div key={section.id} className="mb-16">

              <h2 className="font-art text-5xl mb-6">
                {section.title}
              </h2>

              <div className="mx-4 grid md:grid-cols-3 gap-6">

                {filtered.map((art) => (

                  <Link key={art.id} href={`/artwork/${art.id}`}>

                    <img
  src={getImageUrl(art.image, "artworks")}
  className="h-[250px] w-full object-cover rounded-[20px] mb-3"
/>

                    <p>{art.title}</p>

                  </Link>

                ))}

              </div>

            </div>

          )
        })}

      </div>

      {/* 🔥 ARTIST SPOTLIGHT */}

      <div className="px-6 md:px-12 pb-20">

        <h2 className="text-2xl mb-6">
          Artist Spotlight
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {artists.map((artist) => (

            <Link key={artist.id} href={`/artists/${artist.slug}`}>

              <img
                src={artist.image}
                className="h-[300px] w-[80%] object-cover"
              />

              <p className="mt-2">{artist.name}</p>

            </Link>

          ))}

        </div>

      </div>

    </main>
  )
}