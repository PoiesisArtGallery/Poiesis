"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { getImageUrl } from "@/lib/getImage"

export default function BlogsPage() {

  const [data, setData] = useState<any[]>([])

  useEffect(() => {

    const fetch = async () => {
      const { data } = await supabase.from("blogs").select("*")
      setData(data || [])
    }

    fetch()

  }, [])

  return (

    <div className="px-10 py-16">

      <h1 className="text-4xl mb-10">Blogs & Stories</h1>

      <div className="grid md:grid-cols-3 gap-10">

        {data.map((item) => (

          <Link key={item.id} href={`/blogs/${item.slug}`}>

            <img
              src={getImageUrl(item.images?.[0], "artworks")}
              className="h-[250px] w-full object-cover"
            />

            <h2 className="mt-3">{item.title}</h2>
            <p className="text-sm text-gray-600">
              {item.short_info}
            </p>

          </Link>

        ))}

      </div>

    </div>

  )
}