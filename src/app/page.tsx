"use client"

import HeroSlider from "@/components/HeroSlider"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import ArtistMagazine from "@/components/ArtistMagazine"
import ArtistGallery from "@/components/ArtistGallery"
import { supabase } from "@/lib/supabase"

import { getImageUrl } from "@/lib/getImage"
export default function HomePage() {

  const [sections, setSections] = useState<any[]>([])
const [artworks, setArtworks] = useState<any[]>([])
const [artists, setArtists] = useState<any[]>([])

useEffect(() => {

  const fetchData = async () => {

    const { data: sec } = await supabase.from("homepage_sections").select("*")
    const { data: arts } = await supabase.from("artworks").select("*")
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

  

  const Section = ({ title, items }: any) => (
  <section className="px-6 md:px-12 py-16">

    <h2 className="text-2xl md:text-3xl font-heading mb-10 text-center">
      {title}
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-auto">

      {items?.map((artist: any) => (

        <div key={artist.id} className="group">

          <div className="overflow-hidden rounded-xl shadow-sm">

            <Image
              src={getImageUrl(artist.image, "artists")}
              alt={artist.name}
              width={400}
              height={500}
              
              className="w-full aspect-auto object-contain group-hover:scale-105 transition duration-500"
            />

          </div>

          <div className="mt-4">

            <p className="font-medium">{artist.name}</p>
            <p className="text-sm text-gray-600">{artist.nationality}</p>

            <Link
              href={`/artists/${artist.slug}`} // ✅ FIXED
              className="inline-block mt-2 text-sm underline text-purple-600 hover:opacity-70"
            >
              Show More
            </Link>

          </div>

        </div>

      ))}

    </div>

  </section>
)

  return (

    <main className="bg-[#ffefe4] text-black">

      {/* HERO */}
     <div className="max-w-5xl mx-auto px-4">
  <HeroSlider />
</div>
      {/* OFFER */}
      <div className="marquee bg-black py-2">

  <div className="marquee-inner">

    <span className="rainbow-text blink-soft font-accent text-sm md:text-lg tracking-wide px-6">

      🎉 Limited Time Offer — Get 10%–20% OFF on Selected Artworks | Free Shipping Available 🎉

    </span>

  </div>

</div>

     {sections.map((section) => {

  const filtered = artworks.filter((art) =>
    section.artworks?.includes(art.title)
  )

  if (filtered.length === 0) return null

  return (

    <div key={section.id} className="mt-16">

      <h2 className="text-xl sm:text-2xl md:text-4xl mx-8 font-heading font-bold underline mb-6">{section.title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-auto">

        {filtered.map((art) => (

          <Link key={art.id} href={`/artwork/${art.id}`}>

            <img
              src={getImageUrl(art.image, "artworks")}
              className="mx-4 w-full h-[250px] object-contain rounded-[30px]"
            />

            <p className="text-xl font-art mb-2 mx-8 hover:underline hover:text-blue-900 transition">{art.title}</p>

          </Link>

        ))}

      </div>

    </div>

  )
})}

      <ArtistGallery />

      {/* EXHIBITIONS */}
      <section className="bg-white font-art px-6 md:px-12 py-16 text-center">

        <h2 className="font-art text-xl sm:text-2xl md:text-xl underline mb-6">
          Exhibitions & Events
        </h2>

        <p className="text-red-700 mb-6 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto">
          Experience curated exhibitions that explore artistic depth,
          cultural narratives, and visual storytelling.
        </p>

        <Link
          href="/exhibitions"
          className="font-bold text-sm border rounded-[20px] px-3 py-1 hover:bg-black hover:text-white transition"
        >
          Show More
        </Link>

      </section>

      {/* ARTIST */}
      

      <ArtistMagazine />

      {/* CTA */}
      <section className="bg-black text-white text-center py-16">

        <h2 className="text-4xl underline font-heading mb-4">
          Bring Art Into Your Space
        </h2>

        <p className="text-gray-200 mb-6">
          Discover artworks that transform spaces into experiences.
        </p>

        <Link
          href="/gallery"
          className="font-bold border rounded-[20px] px-6 py-3 hover:bg-yellow-400 hover:text-black transition"
        >
          Browse Collection
        </Link>
<section className="bg-[#0d0d0d] text-white px-6 md:px-12 py-20">

  <div className="grid md:grid-cols-3 lg:grid-cols-2 gap-10 text-center">

    {/* 1 */}
    <div>
      <p className="text-2xl mb-3">🚚</p>
      <p className="font-medium font-art">Free Shipping</p>
      <p className="text-sm text-gray-400 mt-1">
        *Above ₹8000 (India) & ₹40000 (International)
      </p>
    </div>

    {/* 2 */}
    <div>
      <p className="text-2xl mb-3">📞</p>
      <p className="font-medium font-art">24×7 Support</p>
      <p className="text-sm text-gray-400 mt-1">
        Always here to help you
      </p>
    </div>

    {/* 3 */}
    <div>
      <p className="text-2xl mb-3">🔁</p>
      <p className="font-medium font-art">7 Days Return</p>
      <p className="text-sm text-gray-400 mt-1">
        *Exchange available
      </p>
    </div>

    {/* 4 */}
    <div>
      <p className="text-2xl mb-3">📜</p>
      <p className="font-medium font-art">Authenticity Certificate</p>
      <p className="text-sm text-gray-400 mt-1">
        With all original artworks
      </p>
    </div>

    {/* 5 */}
    <div>
      <p className="text-2xl mb-3">🎨</p>
      <p className="font-medium font-art">Pan India Service</p>
      <p className="text-sm text-gray-400 mt-1 mb-3">
        Murals, graffiti & commissions
      </p>
    </div>

    {/* 6 */}
    <div>
      <p className="text-2xl mb-3">🔒</p>
      <p className="font-medium font-art">Secure Payments</p>
      <p className="text-sm text-gray-400 mt-1 mb-3">
        Powered by Razorpay
      </p>
    </div>

  </div>
  <div className="grid grid-cols-6 gap-4">
  <div className="bg-red-500 h-20"></div>
  <div className="bg-blue-500 h-20"></div>
  <div className="bg-green-500 h-20"></div>
  <div className="bg-yellow-500 h-20"></div>
  <div className="bg-purple-500 h-20"></div>
  <div className="bg-green-700 h-20"></div>
</div>

</section>
      </section>

    </main>

  )

}