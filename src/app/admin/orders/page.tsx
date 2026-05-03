"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function OrdersPage() {

  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
    setOrders(data || [])
  }

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status === filter)

  return (

    <main className="px-10 py-16">

      <h1 className="text-3xl mb-6">Orders</h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">

        {["All", "In Process", "Delivered"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="border px-4 py-1"
          >
            {f}
          </button>
        ))}

      </div>

      {/* LIST */}
      <div className="space-y-4">

        {filteredOrders.map((order) => (

          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block border p-4 hover:bg-gray-100"
          >

            <div className="flex justify-between">

              <div>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-gray-500">{order.email}</p>
              </div>

              <div className="text-right">
                <p>₹ {order.total}</p>
                <p className="text-sm">{order.status}</p>
              </div>

            </div>

          </Link>

        ))}

      </div>

    </main>

  )
}