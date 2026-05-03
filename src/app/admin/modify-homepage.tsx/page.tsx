"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getImageUrl } from "@/lib/getImage"

export default function ModifyHomepage() {

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])

  const [section, setSection] = useState<any>(null)
  const [artworks, setArtworks] = useState<any[]>([])

  const [allArtworks, setAllArtworks] = useState<any[]>([])
  const [allSections, setAllSections] = useState<any[]>([])

  const [showAdd, setShowAdd] = useState(false)
  const [artQuery, setArtQuery] = useState("")
  const [artSuggestions, setArtSuggestions] = useState<any[]>([])

  // 🔥 FETCH DATA
  useEffect(() => {

    const fetch = async () => {

      const { data: arts } = await supabase
        .from("artworks")
        .select("*")

      const { data: secs } = await supabase
        .from("homepage_sections")
        .select("*")

      setAllArtworks(arts || [])
      setAllSections(secs || [])
    }

    fetch()

  }, [])

  // 🔍 SEARCH SECTION
  const handleSearch = (value: string) => {

    setQuery(value)

    const lower = value.toLowerCase()

    let result: any[] = []

    allSections.forEach(s => {
      if (s.title.toLowerCase().includes(lower)) {
        result.push({ type: "section", data: s, label: s.title })
      }
    })

    setSuggestions(result.slice(0, 6))
  }

  // 🔍 SELECT SECTION
  const handleSelect = (item: any) => {

    setSuggestions([])
    setQuery(item.label)

    setSection(item.data)

    const filtered = allArtworks.filter(a =>
      item.data.artworks?.includes(a.title)
    )

    setArtworks(filtered)
  }

  // ❌ REMOVE ARTWORK
  const remove = async (title: string) => {

    const updated = section.artworks.filter((t: string) => t !== title)

    await supabase
      .from("homepage_sections")
      .update({ artworks: updated })
      .eq("id", section.id)

    handleSelect({ type: "section", data: { ...section, artworks: updated }, label: section.title })
  }

  // 🗑 DELETE SECTION
  const deleteSection = async () => {

    const confirmDelete = confirm("Delete this section permanently?")

    if (!confirmDelete) return

    const { error } = await supabase
      .from("homepage_sections")
      .delete()
      .eq("id", section.id)

    if (error) {
      alert("Delete failed ❌")
      return
    }

    alert("Section deleted 🗑️")

    setSection(null)
    setArtworks([])
    setQuery("")
  }

  // 🔍 SEARCH ARTWORK
  const handleArtSearch = (value: string) => {

    setArtQuery(value)

    if (!value.trim()) {
      setArtSuggestions([])
      return
    }

    const lower = value.toLowerCase()

    const result = allArtworks.filter(a =>
      a.title.toLowerCase().includes(lower)
    )

    setArtSuggestions(result.slice(0, 6))
  }

  // ➕ ADD ARTWORK
  const addArtwork = async (title: string) => {

    if (section.artworks?.includes(title)) {
      alert("Already added ❌")
      return
    }

    const updated = [...(section.artworks || []), title]

    await supabase
      .from("homepage_sections")
      .update({ artworks: updated })
      .eq("id", section.id)

    alert("Added ✅")

    setShowAdd(false)
    setArtQuery("")
    setArtSuggestions([])

    handleSelect({ type: "section", data: { ...section, artworks: updated }, label: section.title })
  }

  return (

    <div className="p-10">

      <h1 className="text-xl font-bold mb-6">
        Modify Homepage Section
      </h1>

      {/* 🔍 SEARCH SECTION */}
      <input
        placeholder="Search section"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="border rounded-[50] text-blue-900 font-bold px-6 py-3"
      />

      {suggestions.map((s, i) => (
        <div
          key={i}
          onClick={() => handleSelect(s)}
          className="cursor-pointer hover:bg-gray-100 px-2 py-1"
        >
          {s.label}
        </div>
      ))}

      {/* ✅ SECTION ACTIONS */}
      {section && (

        <div className="mt-6 space-y-4">

          <h2 className="text-lg font-bold">
            {section.title}
          </h2>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-black text-white px-3 py-1"
            >
              Add Artwork
            </button>

            <button
              onClick={deleteSection}
              className="bg-red-600 text-white px-3 py-1"
            >
              Delete Section
            </button>

          </div>

          {/* 🔍 ADD ARTWORK SEARCH */}
          {showAdd && (

            <div>

              <input
                placeholder="Search artwork to add"
                value={artQuery}
                onChange={(e) => handleArtSearch(e.target.value)}
                className="border px-3 py-2 w-full mt-2"
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

          )}

          {/* 📦 ARTWORK LIST */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {artworks.map((a) => (

              <div key={a.id} className="border p-2">

                <img
                  src={getImageUrl(a.image)}
                  className="h-[120px] w-full object-cover"
                />

                <p className="text-sm">{a.title}</p>

                <button
                  onClick={() => remove(a.title)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  )
}