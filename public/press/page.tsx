"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AddContent() {

  const [type, setType] = useState("exhibitions")
  const [form, setForm] = useState({
    title: "",
    short: "",
    full: "",
    images: ""
  })

  const handleSubmit = async () => {

    const slug = form.title.toLowerCase().replace(/\s+/g, "-")

    const imagesArray = form.images.split(",").map(i => i.trim())

    const { error } = await supabase
      .from(type)
      .insert([{
        title: form.title,
        slug,
        short_info: form.short,
        full_info: form.full,
        images: imagesArray
      }])

    if (error) {
      alert(error.message)
      return
    }

    alert("Added successfully ✅")
  }

  return (

    <div className="p-10 space-y-4">

      <h1>Add Content</h1>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="exhibitions">Exhibition/Event</option>
        <option value="press">Press</option>
        <option value="blogs">Blog</option>
      </select>

      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Short Info"
        onChange={(e) => setForm({ ...form, short: e.target.value })}
      />

      <textarea
        placeholder="Detailed Info"
        onChange={(e) => setForm({ ...form, full: e.target.value })}
      />

      <input
        placeholder="Images (comma separated filenames)"
        onChange={(e) => setForm({ ...form, images: e.target.value })}
      />

      <button onClick={handleSubmit}>
        Submit
      </button>

    </div>

  )
}