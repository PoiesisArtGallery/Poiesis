"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Footer from "@/components/Footer"

export default function AddContentForm({ table }: any) {

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
      .from(table)
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

    <div className="p-10 space-y-4 max-w-xl">

      <h1 className="text-xl text-blue font-bold underline capitalize">
        Add {table}
      </h1>

      <input
        placeholder="Title"
        className="text-blue border rounded-[40px] p-2 w-full"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Short Info"
        className="border rounded-[40px] p-2 w-full"
        onChange={(e) => setForm({ ...form, short: e.target.value })}
      />

      <textarea
        placeholder="Detailed Info"
        className="border rounded-[40px] p-2 w-full"
        onChange={(e) => setForm({ ...form, full: e.target.value })}
      />

      <input
        placeholder="Images (comma separated filenames)"
        className="border rounded-[40px] p-2 w-full"
        onChange={(e) => setForm({ ...form, images: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-black rounded-[20px]  text-white px-4 py-2"
      >
        Submit
      </button>
   
    </div>

  )
}