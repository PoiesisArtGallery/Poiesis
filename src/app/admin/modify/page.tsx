"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { globalSearch } from "@/lib/search"

export default function ModifyPage() {

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
const fetchResults = async () => {
  const data = await globalSearch(query)
  setResults(data)
}
  // 🔍 SEARCH
  const search = async () => {
    const data = await globalSearch(query)
    setResults(data)
    setSuggestions([])
  }

  // 🔍 LIVE SUGGESTIONS
  useEffect(() => {
    const fetch = async () => {
      const data = await globalSearch(query)
      setSuggestions(data)
    }

    if (query.length > 1) fetch()
  }, [query])

  return (

    <main className="px-10 py-16">

      <h1 className="text-2xl mb-6">Modify Entries</h1>

      {/* SEARCH */}
      <div className="relative flex gap-2 mb-6">

        <input
          placeholder="Search artwork or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-[20px] px-3 py-2 w-full mt-2 mb-4"
        />

        <button
          onClick={search}
          className="bg-black rounded-[15px] text-white px-4 hover:bg-yellow-400 hover:text-black transition font-bold mt-2 mb-4"
        >
          Search
        </button>

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border rounded-[20px] shadow z-50">

            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => {
                  setQuery(s.title || s.name)
                  setSuggestions([])
                  setResults([s])
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {s.title || s.name}
              </div>
            ))}

          </div>
        )}

      </div>

      {/* RESULTS */}
      <div className="space-y-6">

        {results.map((item) => {

          const type = item.type || (item.artist ? "artwork" : "artist")

          return (

            <div key={item.id} className="border rounded-[20px] p-4 space-y-3 mb-4">

              {/* TITLE / NAME */}
              <input
                value={item.title || item.name || ""}
                onChange={(e) =>
                  setResults(prev =>
                    prev.map(r =>
                      r.id === item.id
                        ? type === "artwork"
                          ? { ...r, title: e.target.value }
                          : { ...r, name: e.target.value }
                        : r
                    )
                  )
                }
                className="border rounded-[20px] px-2 py-1 w-full"
                placeholder={type === "artist" ? "Artist Name" : "Title"}
              />

              {/* ================= ARTWORK ================= */}
              {type === "artwork" && (

                <>
                  <input
                    value={item.artist || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, artist: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                    placeholder="Artist"
                  />

                  <input
                    value={item.medium || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, medium: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                    placeholder="Medium"
                  />

                  <input
                    value={item.dimensions || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, dimensions: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                    placeholder="Dimensions"
                  />

                  <input
                    value={item.price || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, price: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                    placeholder="Price"
                  />

                  <select
                    value={item.category || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, category: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                  >
                    <option>Paintings</option>
                    <option>Sketch</option>
                    <option>Murals</option>
                    <option>Graphics / Printmaking</option>
                    <option>Limited Edition</option>
                  </select>

                  <select
                    value={item.status || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, status: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                  >
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                    <option>Exhibition Only</option>
                    <option>Available for Commission</option>
                  </select>

                  <textarea
                    value={item.info || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, info: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                    placeholder="Description"
                  />
                </>
              )}

              {/* ================= ARTIST ================= */}
              {type === "artist" && (

                <>
                  <textarea
                    value={item.short_bio || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, short_bio: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                    placeholder="Short Bio"
                  />

                  <textarea
                    value={item.full_bio || ""}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, full_bio: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded-[20px] px-2 py-1 w-full"
                    placeholder="Full Bio"
                  />
                </>
              )}

              {/* IMAGE */}
              <input
                value={item.image || ""}
                onChange={(e) =>
                  setResults(prev =>
                    prev.map(r =>
                      r.id === item.id ? { ...r, image: e.target.value } : r
                    )
                  )
                }
                className="border rounded-[20px] px-2 py-1 w-full"
                placeholder="Image"
              />

              {/* SLIDESHOW (only artwork) */}
              {type === "artwork" && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.slideshow || false}
                    onChange={(e) =>
                      setResults(prev =>
                        prev.map(r =>
                          r.id === item.id ? { ...r, slideshow: e.target.checked } : r
                        )
                      )
                    }
                  />
                  Show in Slideshow
                </label>
              )}

              {/* ACTIONS */}
              <div className="flex gap-3">

                {/* SAVE */}
                <button
                  onClick={async () => {

  const table = type === "artist" ? "artists" : "artworks"

  let updateData: any = {}

  if (type === "artwork") {
    updateData = {
      title: item.title,
      artist: item.artist,
      medium: item.medium,
      dimensions: item.dimensions,
      price: item.price,
      category: item.category,
      status: item.status,
      info: item.info,
      image: item.image,
      slideshow: item.slideshow
    }
  }

  if (type === "artist") {
    updateData = {
      name: item.name,
      short_bio: item.short_bio,
      full_bio: item.full_bio,
      image: item.image
    }
  }

  const { error } = await supabase
    .from(table)
    .update(updateData)
    .eq("id", item.id)

  if (error) {
    console.error(error)
    alert("Update failed ❌")
    return
  }

  alert("Updated successfully ✅")

  // 🔥 REFETCH FROM DATABASE (REAL FIX)
  await fetchResults()
// 🔥 FORCE REFRESH
window.location.reload()
}}
                  className="bg-black rounded-[15px] text-white px-4 py-2 hover:bg-yellow-400 hover:text-black transition font-bold"
                >
                  Save
                </button>

                {/* DELETE */}
                <button
                  onClick={async () => {

                    const confirmDelete = confirm("Delete permanently?")

                    if (!confirmDelete) return

                    const table = type === "artist" ? "artists" : "artworks"

                    const { error } = await supabase
                      .from(table)
                      .delete()
                      .eq("id", item.id)

                    if (error) {
                      console.error(error)
                      alert("Delete failed ❌")
                      return
                    }

                    setResults(prev => prev.filter(r => r.id !== item.id))

                    alert("Deleted 🗑️")
                  }}
                  className="bg-red-600 rounded-[15px] text-white px-4 py-2 hover:bg-red-800 transition font-bold"
                >
                  Delete
                </button>

              </div>

            </div>

          )
        })}

      </div>

    </main>
  )
}