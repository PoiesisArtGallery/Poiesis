"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Footer from "@/components/Footer"

export default function AddArtist() {

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    short_bio: "",
    full_bio: "",
    Press_Mentions: "",
      Exhibitions: "",
    instagram: "",
    featured: false
  })

  const handleSubmit = async () => {

    if (!form.name) {
      alert("Name is required")
      return
    }
const cleanTitle = form.name.trim()

  // 🔥 DUPLICATE CHECK (CASE-INSENSITIVE)
  const { data: existing, error: checkError } = await supabase
    .from("artists")
    .select("id")
    .ilike("name", cleanTitle)

  if (checkError) {
    console.error(checkError)
    alert("Error checking duplicates ❌")
    return
  }
    const { error } = await supabase
      .from("artists")
      .insert([form])

    if (error) {
  console.error("FULL ERROR:", error)
  alert(error.message || JSON.stringify(error))
  return
}

    alert("Artist added successfully 🎉")

    setForm({
      name: "",
      slug: "",
      image: "",
      short_bio: "",
      full_bio: "",
      Press_Mentions: "",
      Exhibitions: "",
      instagram: "",
      featured: false
    })
  }

  return (

    <div className="space-y-4 max-w-lg">

      <h2 className=" text-3xl font-black underline px-2 py-1 w-full">Add Artist</h2>

      {/* NAME */}
      <input
        placeholder="Artist Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />

      {/* SLUG */}
      <input
        placeholder="Slug (e.g. a-kumar)"
        value={form.slug}
        onChange={(e) =>
          setForm({ ...form, slug: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />

      {/* IMAGE */}
      <input
        placeholder="Image name (uploaded to Supabase storage)"
        value={form.image}
        onChange={(e) =>
          setForm({ ...form, image: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />

      {/* SHORT BIO */}
      <textarea
        placeholder="Short Bio"
        value={form.short_bio}
        onChange={(e) =>
          setForm({ ...form, short_bio: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />

      {/* FULL BIO */}
      <textarea
        placeholder="Full Bio"
        value={form.full_bio}
        onChange={(e) =>
          setForm({ ...form, full_bio: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />
{/* PRESS MENTIONS */}
      <textarea
        placeholder="Press Mentions"
        value={form.Press_Mentions}
        onChange={(e) =>
          setForm({ ...form, Press_Mentions: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />
{/* EXHIBITIONS */}
      <textarea
        placeholder="Exhibitions"
        value={form.Exhibitions}
        onChange={(e) =>
          setForm({ ...form, Exhibitions: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />
      {/* INSTAGRAM */}
      <input
        placeholder="Instagram Link"
        value={form.instagram}
        onChange={(e) =>
          setForm({ ...form, instagram: e.target.value })
        }
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />

      {/* FEATURED */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) =>
            setForm({ ...form, featured: e.target.checked })
          }
        />
        Featured Artist (for homepage spotlight)
      </label>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="bg-black rounded-[50px] text-white px-4 py-2 w-full"
      >
        Submit
      </button>
     
    </div>

  )
}