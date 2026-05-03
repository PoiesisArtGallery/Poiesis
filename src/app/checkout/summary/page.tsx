"use client"

import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type ShippingType = {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
}

export default function SummaryPage() {

  const items = useCartStore((state) => state.items)
  const router = useRouter()

  const [shipping, setShipping] = useState<ShippingType | null>(null)

  useEffect(() => {
    const data = localStorage.getItem("shipping")

    if (data) {
      setShipping(JSON.parse(data))
    } else {
      router.push("/checkout")
    }
  }, [router])

  // 💰 Calculate total
  const total = items.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9]/g, ""))
    const quantity = item.quantity || 1
    return sum + price * quantity
  }, 0)

  const handlePayment = () => {
    router.push("/checkout/payment")
  }

  return (

    <main className="px-6 md:px-10 py-16 max-w-3xl mx-auto">

      <h1 className="text-4xl font-heading underline mb-10 text-center">
        Order Summary
      </h1>

      {/* 🧾 SHIPPING DETAILS */}
      {shipping && (
        <div className="border rounded-[15px] p-4 mb-8">
          <h2 className="text-xl mb-2">Shipping Details</h2>

          <p>{shipping.name}</p>
          <p>{shipping.address}</p>
          <p>{shipping.city}, {shipping.state} - {shipping.pincode}</p>
          <p>{shipping.phone}</p>
          <p>{shipping.email}</p>
        </div>
      )}

      {/* 🛒 CART ITEMS */}
      <div className="border rounded-[15px] p-4 mb-8">

        <h2 className="text-xl mb-4">Items</h2>

        {items.map((item) => {

          const price = Number(item.price.replace(/[^0-9]/g, ""))
          const quantity = item.quantity || 1

          return (
            <div key={item.id} className="flex justify-between mb-2">

              <div>
                {item.title} × {quantity}
              </div>

              <div>
                ₹{price * quantity}
              </div>

            </div>
          )
        })}

      </div>

      {/* 💰 TOTAL */}
      <div className="text-xl font-bold mb-6 text-right">
        Total: ₹{total}
      </div>

      {/* 🌍 CURRENCY NOTE */}
      <p className="text-sm text-blue-700 font-bold mb-4 text-right">
        *Final amount may vary slightly due to currency exchange charges for international payments.
      </p>

      {/* 💳 BUTTON */}
      <button
        onClick={handlePayment}
        className="font-bold text-lg bg-black  text-white rounded-[18px] w-full py-3 hover:bg-yellow-400 hover:text-black transition"
      >
        Proceed to Payment
      </button>

    </main>

  )

}