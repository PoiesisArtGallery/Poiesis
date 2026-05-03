"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function SearchBar() {

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const router = useRouter()

  const categories = [
    "Paintings",
    "Sketch",
    "Murals",
    "Graphics / Printmaking",
    "Limited Edition"
  ]

  const handleSearch = async (value: string) => {

    setQuery(value)

    if (!value.trim()) {
      setResults([])
      return
    }

    const lower = value.toLowerCase()

    let suggestions: any[] = []

    // 🔥 FETCH FROM SUPABASE
    const { data: artworks } = await supabase
      .from("artworks")
      .select("*")

    const { data: artists } = await supabase
      .from("artists")
      .select("*")

    // 🔥 ARTWORKS
    artworks?.forEach((art) => {
      if (art.title?.toLowerCase().includes(lower)) {
        suggestions.push({
          type: "artwork",
          label: art.title,
          id: art.id
        })
      }
    })

    // 🔥 ARTISTS
    artists?.forEach((artist) => {
      if (artist.name?.toLowerCase().includes(lower)) {
        suggestions.push({
          type: "artist",
          label: artist.name,
          slug: artist.slug
        })
      }
    })

    // 🔥 CATEGORIES
    categories.forEach((cat) => {
      if (cat.toLowerCase().includes(lower)) {
        suggestions.push({
          type: "category",
          label: cat
        })
      }
    })

    // 🔥 EVENTS / EXHIBITIONS
    if ("exhibition".includes(lower) || "event".includes(lower)) {
      suggestions.push({
        type: "event",
        label: "Exhibitions & Events"
      })
    }

    setResults(suggestions.slice(0, 6))
  }

  const handleSelect = (item: any) => {

    setQuery("")
    setResults([])

    if (item.type === "artwork") {
      router.push(`/artwork/${item.id}`)
    }

    if (item.type === "artist") {
      router.push(`/artists/${item.slug}`)
    }

    if (item.type === "category") {
      router.push(`/gallery#${item.label}`)
    }

    if (item.type === "event") {
      router.push(`/exhibitions`)
    }
  }

  return (

    <div className="relative w-full max-w-md">

      {/* INPUT */}
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search artworks, artists...🔎️"
        className="w-[80%] border px-4 py-2 rounded-full text-sm outline-none"
      />

      {/* DROPDOWN */}
      {results.length > 0 && (

        <div className="absolute top-full left-0 w-full bg-white border mt-2 rounded-lg shadow-md z-50">

          {results.map((item, i) => (

            <div
              key={i}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
            >

              <span>{item.label}</span>
              <span className="text-gray-400 text-xs">
                {item.type}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>

  )
}