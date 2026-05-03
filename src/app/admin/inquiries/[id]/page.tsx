"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getImageUrl } from "@/lib/getImage"

export default function InquiryDetail() {

  const params = useParams()   // ✅ FIX
  const id = params?.id        // ✅ SAFE ACCESS

  const [data, setData] = useState<any>(null)

  useEffect(() => {

    if (!id) return

    const fetchData = async () => {

      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      setData(data)
    }

    fetchData()

  }, [id])

  if (!data) return <div className="p-10">Loading...</div>

  return (

    <main className="px-10 py-16 space-y-6">

      <h1 className="text-2xl mb-4">Inquiry Details</h1>

      {/* INFO */}
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Phone:</strong> {data.phone}</p>
      <p><strong>Place:</strong> {data.place}</p>
      <p><strong>Work Type:</strong> {data.work_type}</p>

      {/* MESSAGE */}
      <div>
        <h2 className="text-lg">Message</h2>
        <p>{data.message}</p>
      </div>

      {/* IMAGES */}
      <div>
        <h2 className="text-lg mb-2">Images</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {data.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={getImageUrl(img, "inquiries")}
              className="h-[200px] w-full object-cover"
            />
          ))}
        </div>
      </div>

      {/* STATUS */}
      <div>
        <p><strong>Status:</strong> {data.status}</p>

        <button
          onClick={async () => {

            const newStatus =
              data.status === "Pending"
                ? "Completed"
                : "Pending"

            const { error } = await supabase
              .from("inquiries")
              .update({ status: newStatus })
              .eq("id", data.id)

            if (error) {
              alert("Update failed")
              return
            }

            setData({ ...data, status: newStatus })

          }}
          className="bg-black text-white px-4 py-2 mt-2"
        >
          Toggle Status
        </button>

      </div>

    </main>
  )
}