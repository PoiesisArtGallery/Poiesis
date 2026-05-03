"use client"
import Link from "next/link"
import { useState } from "react"
import AddArtwork from "./AddArtwork"
import AddArtist from "./AddArtist"
import Addexhibition from "./Addexhibition"
import Addpress from "./Addpress"
import Addblogs from "./Addblogs"
export default function NewEntry() {

  const [type, setType] = useState("")

  return (

    <main className="px-10 py-16">

      <h1 className="font-bold underline text-2xl mb-6">Add New Entry</h1>

      {/* SELECT TYPE */}
      <div className="flex gap-4 mb-8">

        {["Artwork", "Artist", "Exhibition & Events", "Press", "Blogs"].map((t) => (

          <button
            key={t}
            onClick={() => setType(t)}
            className="border rounded-[50px] px-4 py-2"
          >
            {t}
          </button>

        ))}

      </div>

      {/* FORMS */}
      {type === "Artwork" && <AddArtwork />}
      {type === "Artist" && <AddArtist />}
      {type === "Exhibition & Events" && <Addexhibition />}
      {type === "Press" && <Addpress />}
      {type === "Blogs" && <Addblogs />}
    </main>

  )
}