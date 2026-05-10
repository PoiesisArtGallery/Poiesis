"use client"

import { useEffect, useState } from "react"
import { MessageCircleMore, Mail, Import } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function FloatingActions() {
const [email, setEmail] = useState("")
const [name, setName] = useState("")
const [loading, setLoading] = useState(false)
  const [openWhatsApp, setOpenWhatsApp] = useState(false)
  const [openSubscribe, setOpenSubscribe] = useState(false)
  const [openArtist, setOpenArtist] = useState(false)

  const [form, setForm] = useState({
    name: "",
    work: "",
    phone: "",
    email: ""
  })
const handleSubscribe = async () => {

  if (!name || !email) {
    alert("Please enter name and email")
    return
  }

  setLoading(true)

  const { error } = await supabase
    .from("subscribers")
    .insert([
      {
        name,
        email
      }
    ])

  if (error) {

    console.error(error)

    if (error.code === "23505") {

      alert("You are already subscribed")

    } else {

      alert("Error: " + error.message)
    }

    setLoading(false)
    return
  }

  // ✅ SEND EMAIL
  await fetch("/api/send-email", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      name,
      email
    })
  })

  alert("Subscribed successfully 🎉")

  setName("")
  setEmail("")

  setOpenSubscribe(false)

  setLoading(false)
}
  // 🔥 AUTO WHATSAPP (once)
  useEffect(() => {

    const seen = localStorage.getItem("whatsapp_seen")

    if (!seen) {
      setTimeout(() => {
        setOpenWhatsApp(true)
        localStorage.setItem("whatsapp_seen", "true")
      }, 10000)
    }

  }, [])

  const handleSubmit = async () => {

  if (!form.name || !form.email) {
    alert("Please fill required details")
    return
  }

  const { error } = await supabase
    .from("artist_applications")
    .insert([form])

  if (error) {
    console.error(error)
    alert("Submission failed")
    return
  }

  // 🔥 SEND EMAIL TO YOU
  await fetch("/api/artist-email", {
    method: "POST",
    body: JSON.stringify(form)
  })

  alert("Application submitted successfully 🎉")

  setForm({
    name: "",
    work: "",
    phone: "",
    email: ""
  })

  setOpenArtist(false)
}
 const [user, setUser] = useState<any>(null)
useEffect(() => {

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  fetchUser()

}, [])
  return (

    <>
      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-2 right-2 flex flex-col gap-3 z-50">
{user?.email === "poiesis.art.gallery.pag@gmail.com" && (
  <Link href="/admin" className=" font-bold font-art text-2xl text-pink-800 border  rounded-full px-2 py-1 hover:bg-yellow-400 hover:text-black hover:underline transition ">
    👤
  </Link>
)}
        {/* 🎨 ARTIST BUTTON */}
        <button
          onClick={() => setOpenArtist(true)}
          
        >
          <Image
            src="/icons/join.png"
            alt="Join Artist"
            width={45}
            height={45}
          />
        </button>

        {/* WHATSAPP */}
        <button
          onClick={() => setOpenWhatsApp(true)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          <MessageCircleMore size={20} />
        </button>

        {/* SUBSCRIBE */}
        <button
          onClick={() => setOpenSubscribe(true)}
          className="bg-black text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          <Mail size={20} />
        </button>

      </div>

      {/* 🎨 ARTIST POPUP */}
      {openArtist && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-[110%] max-w-md">

            <h2 className="text-2xl font-semibold font-art mb-1">
              Calling all creators! 🎨
            </h2>

            <p className="text-sm mb-1">
              Are you an artist looking for your next big break? 🖌️  
              Stop creating in the shadows!  
              If you want your work recognized by a global audience and are ready to start selling your art, join us today and turn your passion into a profession.
            </p>

            <p className="text-sm mb-1 font-medium">
              You create the masterpieces; we provide the stage.  
              Join our community of artists to gain visibility and connect with collectors.
            </p>

            {/* FORM */}
            <div className="space-y-2">

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border px-3 py-0 rounded"
              />

              <input
                placeholder="Type of Work"
                value={form.work}
                onChange={(e) =>
                  setForm({ ...form, work: e.target.value })
                }
                className="w-full border px-3 py-0 rounded"
              />

              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full border px-3 py-0 rounded"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border px-3 py-0 rounded"
              />

            </div>

            <button
              onClick={handleSubmit}
              className="w-[100px] bg-black text-white py-0 mt-2 rounded"
            >
              Submit
            </button>
<button
              onClick={() => setOpenArtist(false)}
              className="w-[100px] mx-3 bg-black text-white py-0 mt-1 rounded"
            >
              Close
            </button>
            <p className="text-xs mt-1 text-center">
              Get recognized. Get discovered. Get paid.  
              Join our artist collective and let’s grow together.
            </p>

            

          </div>

        </div>

      )}
{/* 🟢 WHATSAPP POPUP */}
      {openWhatsApp && (

        <div className="fixed bottom-20 right-6 bg-white p-4 rounded-lg shadow-xl w-[300px] z-50">

          <p className="text-sm mb-3">
            Have any query? Message us.  
            Our representative will answer you shortly.
          </p>

          <a
            href="https://wa.me/919288013878?text=Hi, I have a query regarding your artworks"
            target="_blank"
            className="block bg-green-500 text-white text-center py-2 rounded-md mb-2"
          >
            Chat on WhatsApp
          </a>

          <button
            onClick={() => setOpenWhatsApp(false)}
            className="text-sm text-gray-500 w-full"
          >
            Close
          </button>

        </div>

      )}

      {/* ✉️ SUBSCRIBE POPUP */}
      {openSubscribe && (

        <div className="fixed bottom-20 right-6 bg-white p-4 rounded-lg shadow-xl w-[300px] z-50">

          <p className="text-sm mb-3">
            Subscribe to our newsletter and blogs, and never miss an update.
          </p>
 <input
  type="name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border px-3 py-2 rounded-md mb-2"
/>
          <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border px-3 py-2 rounded-md mb-2"
/>

<button
  onClick={handleSubscribe}
  disabled={loading}
  className="w-full bg-black text-white py-2 rounded-md"
>
  {loading ? "Subscribing..." : "Subscribe"}
</button>

          <button
            onClick={() => setOpenSubscribe(false)}
            className="text-sm text-gray-500 w-full mt-2"
          >
            Close
          </button>

        </div>

      )}


    </>

  )

}