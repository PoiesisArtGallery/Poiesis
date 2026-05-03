"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import ArtworkClient from "@/components/ArtworkClient"

export default function ArtworkPage() {

  const { id } = useParams()

  const [artwork, setArtwork] = useState<any>(null)

  useEffect(() => {

    const fetchArtwork = async () => {

      // ✅ IMPORTANT: id is string → convert to number if needed
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", id)
        .single()

      console.log("ARTWORK:", data, error)

      if (error || !data) return

      setArtwork(data)
    }

    fetchArtwork()

  }, [id])

  // ❌ NOT FOUND
  if (!artwork) {
    return <p className="p-10">Artwork not found</p>
  }

  return <ArtworkClient artwork={artwork} />
}