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

    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    setOrders(data || [])
  }

  // ✅ COUNTS
  const totalOrders = orders.length

  const processingOrders = orders.filter(
    (o) =>
      o.status === "Processing" ||
      o.status === "In Process"
  ).length

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length

  // ✅ FILTER
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status === filter)

  return (

    <main className="px-4 md:px-10 py-10 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">

        <div>

          <h1 className="text-4xl font-black text-gray-900 underline font-heading">
            Orders Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage and track customer orders
          </p>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2 mb-10">

        {/* TOTAL */}
        <div className="bg-black text-white w-[120px] h-[125px] rounded-2xl p-6 shadow-lg">

          <p className="text-sm uppercase font-bold tracking-widest opacity-70">
            Total Orders
          </p>

          <h2 className="text-4xl font-black mt-3">
            {totalOrders}
          </h2>

        </div>

        {/* PROCESSING */}
        <div className="bg-yellow-400 w-[120px] h-[125px] rounded-2xl p-6 shadow-lg">

          <p className="text-sm uppercase font-bold text-black/70">
            Processing
          </p>

          <h2 className="text-4xl font-black mt-3 text-black">
            {processingOrders}
          </h2>

        </div>

        {/* DELIVERED */}
        <div className="bg-green-600 text-white w-[120px] h-[125px] rounded-2xl p-6 shadow-lg">

          <p className="text-sm uppercase font-bold tracking-widest opacity-80">
            Delivered
          </p>

          <h2 className="text-4xl font-black mt-3">
            {deliveredOrders}
          </h2>

        </div>

      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-4 mb-8">

        {["All", "Processing", "Delivered"].map((f) => (

          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-5 py-2 rounded-full font-semibold transition
              ${
                filter === f
                  ? "bg-black text-white shadow-lg"
                  : "bg-white border hover:bg-gray-100"
              }
            `}
          >
            {f}
          </button>

        ))}

      </div>

      {/* ORDERS LIST */}
      <div className="space-y-5">

        {filteredOrders.length === 0 && (

          <div className="bg-white rounded-2xl p-10 text-center shadow">

            <p className="text-gray-500 text-lg">
              No orders found
            </p>

          </div>

        )}

        {filteredOrders.map((order) => (

          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block bg-white rounded-2xl p-5 shadow hover:shadow-xl transition border"
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              {/* LEFT */}
              <div>

                <p className="text-xl font-bold text-gray-900">
                  {order.customer_name}
                </p>

                <p className="text-gray-500">
                  {order.email}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  {new Date(order.created_at).toLocaleString()}
                </p>

              </div>

              {/* RIGHT */}
              <div className="text-left md:text-right">

                <p className="text-2xl font-black text-black">
                  ₹ {order.total}
                </p>

                <span
                  className={`
                    inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold
                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  `}
                >
                  {order.status}
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </main>
  )
}