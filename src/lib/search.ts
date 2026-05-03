import { supabase } from "@/lib/supabase"

export const globalSearch = async (query: string) => {

  if (!query || query.length < 1) return []

  const q = query.toLowerCase()

  // 🔥 FETCH ALL DATA
  const { data: artworks } = await supabase
    .from("artworks")
    .select("*")

  const { data: artists } = await supabase
    .from("artists")
    .select("*")

  // ✅ FILTER IN JS (MORE RELIABLE)
  const artworkResults = (artworks || []).filter((a) =>
    a.title?.toLowerCase().includes(q)
  ).map((a) => ({
    type: "artwork",
    ...a
  }))

  const artistResults = (artists || []).filter((a) =>
    a.name?.toLowerCase().includes(q)
  ).map((a) => ({
    type: "artist",
    ...a
  }))

  const categoryResults = (artworks || []).filter((a) =>
    a.category?.toLowerCase().includes(q)
  ).map((a) => ({
    type: "category",
    category: a.category
  }))

  return [
    ...artworkResults,
    ...artistResults,
    ...categoryResults
  ]
}