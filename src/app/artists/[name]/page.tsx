"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import ArtistClient from "@/components/ArtistClient"

export default function ArtistPage() {

  const params = useParams()

  const name = decodeURIComponent(
    params.name as string
  )

  const [artist, setArtist] = useState<any>(null)

  const [artworks, setArtworks] = useState<any[]>([])

  useEffect(() => {

    const fetchData = async () => {

      // ✅ FETCH ARTIST BY NAME
      const {
        data: artistData,
        error
      } = await supabase
        .from("artists")
        .select("*")
        .eq("name", name)
        .single()

      console.log("ARTIST:", artistData, error)

      if (!artistData) return

      setArtist(artistData)

      // ✅ FETCH ARTWORKS
      const { data: artworksData } = await supabase
        .from("artworks")
        .select("*")
        .eq("artist", artistData.name)

      setArtworks(artworksData || [])
    }

    fetchData()

  }, [name])

  if (!artist) {

    return (

      <div className="p-10 text-2xl font-bold">

        Artist not found

      </div>

    )
  }

  return (

    <ArtistClient
      artist={artist}
      artworks={artworks}
    />

  )
}