"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function InquiryPage() {

  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
      setData(data || [])
    }
    fetch()
  }, [])

  return (

    <main className="px-10 py-16">

      <h1 className="text-4xl mb-6 underline font-heading font-bold">Inquiries</h1>

      {data.map((item) => (

        <Link
          href={`/admin/inquiries/${item.id}`}
          key={item.id}
          className="block"
        >
          <div className="w-[350px] border rounded-[15px] p-4 mb-4 hover:bg-gray-100 cursor-pointer">

            <p><strong>{item.name}</strong></p>
            <p>{item.email}</p>
            <p>{item.phone}</p>
            <p className="mt-2">{item.message}</p>
<p className="text-blue-800 font-semibold">
  Artwork: {item.artwork}
</p>
          </div>
        </Link>

      ))}

    </main>

  )
}