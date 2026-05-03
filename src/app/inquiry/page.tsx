"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import emailjs from "emailjs-com"
export default function InquiryPage() {

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

    // Upload multiple images safely
    if (files.length > 0) {

      for (const file of files) {

  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from("inquiry-images")
    .upload(fileName, file)

  if (error) {
    console.error("UPLOAD ERROR:", error.message)
    alert("Image upload failed: " + error.message)
    continue
  }

  console.log("UPLOAD SUCCESS:", data)

  const { data: publicData } = supabase.storage
    .from("inquiry-images")
    .getPublicUrl(fileName)

  if (publicData?.publicUrl) {
    imageUrls.push(publicData.publicUrl)
  }

}

    }
    try {
  await emailjs.send(
    "service_b90e3xl",
    "template_qk76k5s",
    {
      name: form.name,
      email: form.email,
      phone: form.phone,
      type: form.type,
      message: form.message,
images: imageUrls.join("\n")
    },
    "4zmqOnHAlm2a9dj3z"
  )

  console.log("EMAIL SENT")

} catch (err) {
  console.error("EMAIL ERROR:", err)
}

    // Save to database (ALWAYS RUN — even if images fail)
    const { error } = await supabase
      .from("inquiries")
      .insert([
        {
          ...form,
          image_url: imageUrls
        }
      ])

    if (error) {
      alert("Error saving inquiry")
      console.error("FULL ERROR:", JSON.stringify(error, null, 2))
alert(error?.message || "Database error")
      setLoading(false)
      return
    }

    alert("Inquiry submitted successfully!")

    // Reset form
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
          className="w-full border rounded-[20px]  font-art p-3 text-white bg-gray-800"
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

        {/* File Upload */}

        <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e: any) => setFiles(Array.from(e.target.files))}
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