"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getImageUrl } from "@/lib/getImage"

export default function Detail({ params }: any) {

  const [data, setData] = useState<any>(null)

  useEffect(() => {

    const fetch = async () => {

      const { data } = await supabase
        .from("exhibitions")
        .select("*")
        .eq("slug", params.slug)
        .single()

      setData(data)
    }

    fetch()

  }, [params.slug])

  if (!data) return <div>Loading...</div>

  return (

    <div className="px-10 py-16">

      <h1 className="text-4xl mb-6">{data.title}</h1>

      <p className="mb-8">{data.full_info}</p>

      <div className="grid md:grid-cols-3 gap-6">

        {data.images?.map((img: string, i: number) => (

          <img
            key={i}
            src={getImageUrl(img, "artworks")}
            className="h-[250px] w-full object-cover"
          />

        ))}

      </div>

    </div>

  )
}