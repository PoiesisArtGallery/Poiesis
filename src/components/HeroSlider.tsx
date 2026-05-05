"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"

export default function HeroSlider() {

  const [slides, setSlides] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  // 🔥 FETCH ONLY SLIDESHOW ARTWORKS
  useEffect(() => {

    const fetchSlides = async () => {

      const { data } = await supabase
        .from("artworks")
        .select("*")
        .eq("slideshow", true)

      setSlides(data || [])
    }

    fetchSlides()

  }, [])

  // 🔥 AUTO SLIDE
  useEffect(() => {

    if (slides.length === 0) return

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 8000)

    return () => clearInterval(interval)

  }, [slides])

  if (slides.length === 0) return null
// ✅ MANUAL CONTROLS
  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length)
  }
  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    )
  }
  return (

    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] object-contain overflow-hidden rounded-[15px]">

      {slides.map((art, i) => (

        <Link
          key={art.id}
          href={`/artwork/${art.id}`}
          className={`
            absolute top-0 left-0 w-full h-full
            transition-opacity duration-700
            ${i === index ? "opacity-100 z-10" : "opacity-0"}
          `}
        >

         <div className="w-full h-full flex items-center justify-center bg-gray-100">

  <img
    src={getImageUrl(art.image, "artworks")}
    className="max-h-full max-w-full object-contain rounded-[15px]"
  />

</div>

        </Link>

      ))}

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

        {slides.map((_, i) => (

          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-black" : "bg-gray-400"
            }`}
          />

        ))}

      </div>
 {/* LEFT ARROW */}
      <button
  onClick={prevSlide}
  className="absolute left-5 top-1/2 -translate-y-1/2 
             z-10 
             bg-gray-60 backdrop-blur-md 
             text-white p-3 rounded-full 
             hover:bg-black hover:scale-110 
             transition"
>
  ←
</button>

      {/* RIGHT ARROW */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 
        z-10
        bg-gray-60 backdrop-blur-md 
        text-white p-3 rounded-full 
        hover:bg-black hover:scale-110 
        transition"
      >
        →
      </button>
    </div>

  )
}