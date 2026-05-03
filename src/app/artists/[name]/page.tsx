"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import ArtistClient from "@/components/ArtistClient"

export default function ArtistPage() {

  const { name } = useParams()

  const [artist, setArtist] = useState<any>(null)
  const [artworks, setArtworks] = useState<any[]>([])

  useEffect(() => {

    const fetchData = async () => {

      // 🎯 FETCH ARTIST
      const { data: artistData, error } = await supabase
        .from("artists")
        .select("*")
        .eq("slug", name)
        .single()

      console.log("ARTIST:", artistData, error)

      if (!artistData) return

      setArtist(artistData)

      // 🎯 FETCH ARTWORKS
      const { data: artworksData } = await supabase
        .from("artworks")
        .select("*")
        .eq("artist", artistData.name)

      setArtworks(artworksData || [])

    }

    fetchData()

  }, [name])

  if (!artist) {
    return <div>Artist not found</div>
  }

  return (
    <ArtistClient
      artist={artist}
      artworks={artworks}
    />
  )
}