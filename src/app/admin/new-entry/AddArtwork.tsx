"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Footer from "@/components/Footer"

export default function AddArtwork() {

  const [artists, setArtists] = useState<any[]>([])

  const [form, setForm] = useState({
    title: "",
    artist: "",
    price: "",
    category: "",
    image: "",
    dimensions: "",
    medium: "",
    status: "",
    info: "",
    slideshow: false,
    initialLikes: "",
initialComments: ""
  })

  // ✅ FETCH ARTISTS FOR DROPDOWN
  useEffect(() => {

    const fetchArtists = async () => {
      const { data } = await supabase
        .from("artists")
        .select("name")

      setArtists(data || [])
    }

    fetchArtists()

  }, [])

 const handleSubmit = async () => {

  if (!form.title || !form.artist) {
    alert("Title & Artist required")
    return
  }

  const cleanTitle = form.title.trim()

  // 🔥 DUPLICATE CHECK
  const { data: existing, error: checkError } =
    await supabase
      .from("artworks")
      .select("id")
      .ilike("title", cleanTitle)

  if (checkError) {
    console.error(checkError)
    alert("Error checking duplicates ❌")
    return
  }

  if (existing && existing.length > 0) {
    alert("Artwork already exists ❌")
    return
  }

  // 🔥 INSERT ARTWORK
  const { data: artwork, error } =
    await supabase
      .from("artworks")
      .insert([
        {
          ...form,
          title: cleanTitle,
        },
      ])
      .select()
      .single()

  if (error) {
    console.error(error)
    alert(error.message)
    return
  }

  // 🔥 RANDOM INITIAL LIKES
  const randomLikes =
  form.initialLikes ||

  (
    Math.floor(
      Math.random() * (2000 - 1000 + 1)
    ) + 1000
  )

  // 🔥 RANDOM INITIAL COMMENTS
  const randomComments =
  form.initialComments ||

  (
    Math.floor(
      Math.random() * (1000 - 400 + 1)
    ) + 400
  )

  // 🔥 CREATE ARTWORK STATS
  const { error: statsError } =
   await supabase
  .from("artwork_stats")
  .insert({
    artwork_id: artwork.id,

    title: artwork.title,
    artist: artwork.artist,

    likes: randomLikes,
    comments_count: randomComments,
  })

  if (statsError) {
    console.error(statsError)
  }

  alert("Artwork added 🎉")

  // RESET FORM
  setForm({
    title: "",
    artist: "",
    price: "",
    category: "",
    image: "",
    dimensions: "",
    medium: "",
    status: "",
    info: "",
    slideshow: false,
    initialLikes: "",
initialComments: "",
  })
}

    
const categories = [
  "Paintings",
  "Sketch",
  "Murals",
  "Sculpture",
  "Snapshots",
  "Graphics / Printmaking",
  "Limited Edition"
]
const statuses = [
  "In Stock",
  "Out of Stock",
  "Exhibition Only",
  "Available for Commission"
]
const medium = [
  "Watercolor on Paper",
  "Acrylic on Canvas",
  "Pencil on Paper",
  "Oil on Canvas",
  "Acrylic on paper",
  "Oil Pastels on Paper"
]
const dimensions = [
  "7\" * 10\" ",
   "8\" * 12\" ",
   "9.5\" * 15\" ",
  "11\" * 15\" ",
  "8\" * 11\" ",
  "21\" * 28\" ",
  "36\" * 48\" ",
  "30\" * 36\" ",
  "24\" * 30\" "
]
  return (
    
<div className="space-y-4 max-w-lg">

      <h2 className=" text-3xl font-black underline px-2 py-1 w-full">Add Artwork</h2>

    <div className="space-y-3 ">

      <input placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />

      {/* ✅ DROPDOWN */}
      <select
        value={form.artist}
        onChange={(e) => setForm({ ...form, artist: e.target.value })}
        className="border rounded-[50px] text-red-900 px-2 py-1 w-full"
      >
        <option value="">Select Artist</option>

        {artists.map((a, i) => (
          <option key={i} value={a.name}>
            {a.name}
          </option>
        ))}

      </select>

      <input placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />

      <select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  className="border rounded-[50px] px-2 py-1 w-full"
>
  <option value="">Select Category</option>

  {categories.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>

      <input placeholder="Image name (from Supabase storage)"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
        className="border rounded-[50px] font-black px-2 py-1 w-full"
      />
      
       <select
  value={form.dimensions}
  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
  className="font-bold text-red-600 border rounded-[50px] px-2 py-1 w-full"
>
  <option value="">Dimensions</option>

  {dimensions.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
  </select>

       <select
  value={form.medium}
  onChange={(e) => setForm({ ...form, medium: e.target.value })}
  className="font-bold text-red-600 border rounded-[50px] px-2 py-1 w-full"
>
  <option value="">Medium</option>

  {medium.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
  </select>
      <select
  value={form.status}
  onChange={(e) => setForm({ ...form, status: e.target.value })}
  className="font-bold text-blue-600 border rounded-[50px] px-2 py-1 w-full"
>
  <option value="">Select Status</option>

  {statuses.map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
  
</select>
      <textarea
        placeholder="Info"
        value={form.info}
        onChange={(e) => setForm({ ...form, info: e.target.value })}
        className="text-blue-900 border rounded-[20px]  px-2 py-1 w-full"

      />


      <label>
        <input
          type="checkbox"
          checked={form.slideshow}
          onChange={(e) => setForm({ ...form, slideshow: e.target.checked })}
        />
        Slideshow
      </label>
<input
  placeholder="Initial Likes (optional)"
  value={form.initialLikes}
  onChange={(e) =>
    setForm({
      ...form,
      initialLikes: e.target.value,
    })
  }
  className="
    border rounded-[50px]
    font-black px-2 py-1 w-full
  "
/>

<input
  placeholder="Initial Comments (optional)"
  value={form.initialComments}
  onChange={(e) =>
    setForm({
      ...form,
      initialComments: e.target.value,
    })
  }
  className="
    border rounded-[50px]
    font-black px-2 py-1 w-full"
  />
      <button onClick={handleSubmit} className="bg-black rounded-[50px] text-white px-4 mx-5 py-2">
        Submit
      </button>
      
    </div>
    </div>
  )
}