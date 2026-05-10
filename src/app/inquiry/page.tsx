"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"

export default function InquiryPage() {

  const searchParams = useSearchParams()

  const artwork = searchParams.get("artwork") || ""
  const artist = searchParams.get("artist") || ""

  const [form, setForm] = useState({
    name: "",
    place: "",
    type: "",
    phone: "",
    email: "",
    message: ""
  })

  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {

    e.preventDefault()

    setLoading(true)

    let imageUrls: string[] = []

    try {

      // ✅ IMAGE UPLOAD
      if (files.length > 0) {

        for (const file of files) {

          const fileName = `${Date.now()}-${file.name}`

          const { error } = await supabase.storage
            .from("inquiry-images")
            .upload(fileName, file)

          if (error) {

            console.error(error)

            alert("Image upload failed")

            continue
          }

          const { data: publicData } = supabase.storage
            .from("inquiry-images")
            .getPublicUrl(fileName)

          if (publicData?.publicUrl) {
            imageUrls.push(publicData.publicUrl)
          }
        }
      }

      // ✅ SAVE INQUIRY
      const { error } = await supabase
        .from("inquiries")
        .insert([
          {
            ...form,
            artwork,
            artist,
            image_url: imageUrls,
            status: "Pending"
          }
        ])

      if (error) {

        console.error(error)

        alert(error.message)

        setLoading(false)

        return
      }

      // ✅ SEND EMAIL VIA RESEND API & WHATSAPP ALERT VIA TWILIO
      await fetch("/api/inquiry-email", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...form,
          artwork,
          artist,
          images: imageUrls
        })
      })

      alert("Inquiry submitted successfully!")

      // ✅ RESET
      setForm({
        name: "",
        place: "",
        type: "",
        phone: "",
        email: "",
        message: ""
      })

      setFiles([])

    } catch (err) {

      console.error(err)

      alert("Something went wrong")
    }

    setLoading(false)
  }

  return (

    <main className="px-6 md:px-10 py-16 max-w-2xl mx-auto">

      <h1 className="text-4xl font-art underline mb-10 text-center">
        Commission / Inquiry
      </h1>

      {(artwork || artist) && (

        <div className="mb-8 border rounded-[20px] p-4 bg-yellow-50">

          {artwork && (
            <p className="font-bold text-lg text-blue-900">
              Artwork: {artwork}
            </p>
          )}

          {artist && (
            <p className="text-sm text-gray-700 mt-1">
              Artist: {artist}
            </p>
          )}

        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded-[20px] font-art p-3 text-white bg-gray-800"
        />

        <input
          type="text"
          name="place"
          placeholder="Location (City, Country)"
          value={form.place}
          onChange={handleChange}
          required
          className="w-full border rounded-[20px] font-art p-3 text-white bg-gray-800"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="w-full border rounded-[20px] font-art p-3 text-white bg-gray-800"
        >
          <option value="">Type of Work</option>

          <option>Portrait</option>
          <option>Couple Artwork</option>
          <option>Murals</option>
          <option>Wall Design (Cafe/Restaurant)</option>
          <option>Custom Artwork</option>
          <option>Request Availability of an Artwork</option>

        </select>

        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border rounded-[20px] font-art p-3 text-white bg-gray-800"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded-[20px] font-art p-3 text-white bg-gray-800"
        />

        <textarea
          name="message"
          placeholder="Describe your requirement"
          value={form.message}
          onChange={handleChange}
          className="w-full border rounded-[20px] font-art p-3 h-32 text-white bg-gray-800"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e: any) =>
            setFiles(Array.from(e.target.files))
          }
          className="w-full border rounded-[20px] font-art p-3 text-white bg-gray-800"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black font-bold font-art text-white px-5 py-3 rounded-[20px] w-[180px] hover:bg-yellow-400 hover:text-black transition"
        >
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>

      </form>

    </main>
  )
}