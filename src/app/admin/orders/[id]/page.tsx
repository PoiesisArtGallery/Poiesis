"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function OrderDetail({ params }: any) {

  const [order, setOrder] = useState<any>(null)
  const [tracking, setTracking] = useState("")

  useEffect(() => {

    const fetch = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single()

      setOrder(data)
      setTracking(data?.tracking_link || "")
    }

    fetch()

  }, [params.id])

  if (!order) return <div>Loading...</div>

  return (

    <main className="px-10 py-16 space-y-6">

      <h1 className="text-2xl">Order Details</h1>

      <div>
        <p><strong>Name:</strong> {order.customer_name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Address:</strong> {order.address}</p>
      </div>

      <div>
        <p><strong>Total:</strong> ₹ {order.total}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>

      {/* ITEMS */}
      <div>
        <h2 className="text-lg mb-2">Items</h2>

        {order.items?.map((item: any, i: number) => (
          <p key={i}>{item.title} × {item.quantity}</p>
        ))}

      </div>

      {/* TRACKING */}
      <div className="space-y-2">

        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Tracking link"
          className="border px-2 py-1 w-full"
        />

        <button
          onClick={async () => {
            await supabase
              .from("orders")
              .update({ tracking_link: tracking })
              .eq("id", order.id)

            alert("Tracking updated")
          }}
          className="border px-4 py-2"
        >
          Save Tracking
        </button>

        {order.tracking_link && (
          <a
            href={order.tracking_link}
            target="_blank"
            className="text-blue-600 underline"
          >
            Click here to track
          </a>
        )}

      </div>

      {/* STATUS UPDATE */}
      <div className="flex gap-4">

        <button
          onClick={async () => {
            await supabase
              .from("orders")
              .update({ status: "Delivered" })
              .eq("id", order.id)

            alert("Marked as Delivered")
          }}
          className="bg-green-600 text-white px-4 py-2"
        >
          Mark Delivered
        </button>

      </div>

    </main>

  )
}