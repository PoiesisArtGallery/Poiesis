"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import Link from "next/link"
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone
} from "lucide-react"





export default function Footer() {
  const [user, setUser] = useState<any>(null)
useEffect(() => {

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  fetchUser()

}, [])

  return (

    <footer className="bg-[#f6f6af] text-black px-6 md:px-12 py-16">

      {/* 🔝 BRAND */}
      <div className="text-center mb-10">

        <h2 className="text-2xl text-[40px] font-heading mb-3 underline tracking-wide">
          POIESIS ART GALLERY
        </h2>

        <p className="text-gray-900 max-w-4xl mx-auto text-xl leading-relaxed">
          A curated platform showcasing original artworks, portraits,
          and creative expressions designed to bring meaning into spaces.
        </p>

      </div>

      {/* 🔥 ANIMATED DIVIDER */}
      <div className="divider mb-12" />

      {/* 🔲 TWO COLUMNS */}
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">

        {/* LEFT */}
        <div>

          <h4 className="font-medium text-[30px] font-art font-bold underline text-left mb-4">Contact</h4>

          <div className="flex items-center gap-2 text-lg text-gray-700 mb-2">
            <Mail size={20} />
            <span>poiesis.art.gallery.pag@gmail.com</span>
          </div>

          <div className="flex items-center gap-2 text-lg text-gray-700 mb-6">
            <Phone size={20} />
            <span>+91 92880 13878</span>
          </div>

          <h4 className="font-medium text-[30px] font-art font-bold text-left underline mb-3">Follow Us</h4>

          <div className="flex gap-4">

            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                className="p-2 border rounded-full hover:bg-black hover:text-white transition duration-300"
              >
                <Icon size={18} />
              </a>
            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div>

          <h4 className="font-medium text-[35px] font-art underline mb-4">Quick Links</h4>

          <div className="flex flex-col gap-3 text-lg text-gray-900">

            <Link href="/blogs" className="font-bold text-[20px] hover:text-blue-800 hover:underline">
              Blogs
            </Link>

            <Link href="/docs/Privacy_Policy" className="font-bold text-[20px] hover:text-blue-800 hover:underline">
              Privacy Policy
            </Link>

            <Link href="/docs/Terms_and_Conditions" className="font-bold text-[20px] hover:text-blue-800 hover:underline">
              Terms & Conditions
            </Link>

            <Link href="/docs/Refund_Policy" className="font-bold text-[20px] hover:text-blue-800 hover:underline">
              *Refund & Cancellation Policy
            </Link>

            <Link href="/docs/Shipping_Policy" className="font-bold text-[20px] hover:text-blue-800 hover:underline ">
              Shipping Policy
            </Link>
{user?.email === "manishbarnwal925@gmail.com" && (
  <Link href="/admin" className=" font-bold font-art text-xl text-pink-800 border rounded-[10px] px-2 py-1 hover:bg-yellow-400 hover:text-black hover:underline transition w-[35%]">
    Admin Panel
  </Link>
)}
          </div>

        </div>

      </div>

      {/* 🔥 BOTTOM DIVIDER */}
      <div className="divider mt-12 mb-6" />

      {/* 🔻 COPYRIGHT */}
      <div className="text-center font-bold font-heading text-blue-900 text-2xl border rounded-[15px] px-4 py-1 w-fit mx-auto">
        © {new Date().getFullYear()} POIESIS ART GALLERY. All rights reserved.
      </div>

    </footer>

  )

}