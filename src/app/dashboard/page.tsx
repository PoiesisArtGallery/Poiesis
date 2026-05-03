"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {

  const [items, setItems] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {

    const load = async () => {

      const { data } = await supabase.auth.getUser()

      if (!data.user) return

      setUser(data.user)

      const { data: wishlist } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", data.user.id)

      setItems(wishlist || [])
    }

    load()

  }, [])

  return (

    <main className="px-6 md:px-12 py-16">

      <h1 className="text-3xl font-art mb-10">
        Your Wishlist
      </h1>

      {items.length === 0 ? (

        <p className="text-gray-500">
          No items in wishlist
        </p>

      ) : (

        <div className="grid md:grid-cols-3 gap-10">

          {items.map((item) => (

            <div key={item.id} className="group">

              {/* IMAGE */}
              <div className="overflow-hidden rounded-lg">

                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-[250px] object-cover group-hover:scale-105 transition duration-500"
                />

              </div>

              {/* INFO */}
              <div className="mt-3">

                <p className="font-medium">{item.title}</p>

                {/* 🔥 PRICE ADDED */}
                <p className="text-sm text-gray-600">
                  {item.price}
                </p>

                <Link
                  href={`/artwork/${item.artwork_id}`}
                  className="text-sm underline mt-1 inline-block"
                >
                  Show More →
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>

  )

}