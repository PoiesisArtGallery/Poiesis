"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function HomepageAdmin() {

  const [title, setTitle] = useState("")
  const [artworks, setArtworks] = useState<string[]>([])

  const [allSections, setAllSections] = useState<any[]>([])
  const [allArtworks, setAllArtworks] = useState<any[]>([])

  const [sectionSuggestions, setSectionSuggestions] = useState<any[]>([])
  const [artSuggestions, setArtSuggestions] = useState<any[]>([])

  const [sectionQuery, setSectionQuery] = useState("")
  const [artQuery, setArtQuery] = useState("")

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetch = async () => {

      const { data: sections } = await supabase
        .from("homepage_sections")
        .select("*")

      const { data: arts } = await supabase
        .from("artworks")
        .select("id, title")

      setAllSections(sections || [])
      setAllArtworks(arts || [])
    }

    fetch()
  }, [])

  // 🔍 SECTION SEARCH
  const handleSectionSearch = (value: string) => {

    setSectionQuery(value)

    if (!value.trim()) {
      setSectionSuggestions([])
      return
    }

    const lower = value.toLowerCase()

    const result = allSections.filter((s) =>
      s.title.toLowerCase().includes(lower)
    )

    setSectionSuggestions(result.slice(0, 5))
  }

  // 🔍 ARTWORK SEARCH
  const handleArtSearch = (value: string) => {

    setArtQuery(value)

    if (!value.trim()) {
      setArtSuggestions([])
      return
    }

    const lower = value.toLowerCase()

    const result = allArtworks.filter((a) =>
      a.title.toLowerCase().includes(lower)
    )

    setArtSuggestions(result.slice(0, 6))
  }

  // ➕ ADD ARTWORK
  const addArtwork = (name: string) => {

    if (!artworks.includes(name)) {
      setArtworks(prev => [...prev, name])
    }

    setArtQuery("")
    setArtSuggestions([])
  }

  // ❌ REMOVE ARTWORK
  const removeArtwork = (name: string) => {
    setArtworks(prev => prev.filter(a => a !== name))
  }

  // 💾 SAVE
  const handleSubmit = async () => {

    if (!title.trim()) {
      alert("Enter section name")
      return
    }

    // 🔥 DUPLICATE CHECK
    const { data: existing } = await supabase
      .from("homepage_sections")
      .select("id")
      .ilike("title", title.trim())

    if (existing && existing.length > 0) {
      alert("Section already exists ❌")
      return
    }

    const { error } = await supabase
      .from("homepage_sections")
      .insert([{
        title: title.trim(),
        artworks
      }])

    if (error) {
      alert(error.message)
      return
    }

    alert("Section created ✅")

    setTitle("")
    setArtworks([])
  }

  return (

    <div className="p-10 space-y-6 max-w-xl">

      <h1 className="text-xl font-bold underline">
        Create Homepage Section
      </h1>

      {/* 🔥 SECTION NAME INPUT */}
      <div>
        <input
          placeholder="Type or select section name"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            handleSectionSearch(e.target.value)
          }}
          className="border px-3 py-2 w-full rounded-[20px]"
        />

        {sectionSuggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => {
              setTitle(s.title)
              setSectionSuggestions([])
            }}
            className="cursor-pointer hover:bg-gray-100 px-2 py-1"
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* 🔥 ARTWORK SEARCH */}
      <div>
        <input
          placeholder="Search and add artwork"
          value={artQuery}
          onChange={(e) => handleArtSearch(e.target.value)}
          className="border px-3 py-2 w-full rounded-[20px]"
        />

        {artSuggestions.map((a, i) => (
          <div
            key={i}
            onClick={() => addArtwork(a.title)}
            className="cursor-pointer hover:bg-gray-100 px-2 py-1"
          >
            {a.title}
          </div>
        ))}
      </div>

      {/* 🔥 SELECTED ARTWORKS */}
      <div className="space-y-2">
        {artworks.map((a) => (
          <div key={a} className="flex justify-between border px-2 py-1 rounded">
            {a}
            <button
              onClick={() => removeArtwork(a)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded-[20px]"
      >
        Save
      </button>

    </div>
  )
}