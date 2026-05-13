"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
export default function OrderDetail() {

  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [tracking, setTracking] = useState("")

  useEffect(() => {

    const fetch = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
       .eq("id", params.id as string)
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
<div className="flex flex-wrap gap-4 mt-6">

  {/* ✅ ORDER CONFIRMATION */}
  <a
    href={`https://wa.me/91${order.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
`Hello ${order.customer_name},

Thank you for your purchase from POIESIS ART GALLERY 🎨

Your payment has been received successfully.

Order ID: ${order.order_id}

Purchased Artwork(s):
${order.items?.map((i: any) => i.title).join(", ")}

Your order is now being prepared for dispatch.

Thank you for supporting original art.

— POIESIS ART GALLERY`
    )}`}
    target="_blank"
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Order Confirmation
  </a>

  {/* ✅ TRACKING UPDATE */}
  <a
    href={`https://wa.me/91${order.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
`Hello ${order.customer_name},

Your artwork from POIESIS ART GALLERY 🎨 has been shipped.

Tracking Link:
${order.tracking_link || "Tracking will be updated shortly."}

You can track your shipment using the link above.

Thank you for your purchase.

— POIESIS ART GALLERY`
    )}`}
    target="_blank"
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Send Tracking
  </a>

  {/* ✅ SHIPPED MESSAGE */}
  <a
    href={`https://wa.me/91${order.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
`Hello ${order.customer_name},

Good news 🎉

Your order from POIESIS ART GALLERY has been dispatched successfully.

Your artwork is now on its way.

Tracking Link:
${order.tracking_link || "Tracking will be updated shortly."}

Thank you for supporting original art.

— POIESIS ART GALLERY`
    )}`}
    target="_blank"
    className="bg-yellow-600 text-white px-4 py-2 rounded"
  >
    Shipped Notification
  </a>

  {/* ✅ DELIVERED MESSAGE */}
  <a
    href={`https://wa.me/91${order.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
`Hello ${order.customer_name},

Your artwork from POIESIS ART GALLERY 🎨 has been delivered successfully.

We hope the artwork brings beauty and meaning to your space.

Thank you for supporting original art and artists.

We would love to hear your feedback.

— POIESIS ART GALLERY`
    )}`}
    target="_blank"
    className="bg-black text-white px-4 py-2 rounded"
  >
    Delivered Notification
  </a>

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