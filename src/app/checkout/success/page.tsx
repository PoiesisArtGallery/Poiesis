"use client"

import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function SuccessPage() {

  const clearCart = useCartStore((state) => state.clearCart)

  const [shipping, setShipping] = useState<any>(null)
  const [payment, setPayment] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [orderId, setOrderId] = useState("")
  const [orderDate, setOrderDate] = useState("")

  useEffect(() => {

  const ship = localStorage.getItem("shipping")
  const pay = localStorage.getItem("payment")
  const savedItems = localStorage.getItem("orderItems")

  if (ship) setShipping(JSON.parse(ship))

  if (pay) {
    const parsedPay = JSON.parse(pay)
    setPayment(parsedPay)

    // ✅ USE REAL ORDER ID
    if (parsedPay.orderId) {
      setOrderId(parsedPay.orderId)
    } else {
      setOrderId("PAG-" + Date.now())
    }
  }

  if (savedItems) {
    setOrderItems(JSON.parse(savedItems))
  }

  setOrderDate(new Date().toLocaleString())

  // ✅ CLEAR CART
  clearCart()

  // ✅ OPTIONAL CLEANUP
  localStorage.removeItem("cart-storage")

}, [])

  const totalAmount = orderItems.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9]/g, ""))
    const qty = item.quantity || 1
    return sum + price * qty
  }, 0)

  return (

    <main className="min-h-screen bg-[#f5f5f5] px-6 md:px-10 py-16 flex flex-col items-center">

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-section, #print-section * { visibility: visible; }
          #print-section {
            position: absolute;
            left: 0; top: 0; width: 100%;
          }
        }
      `}</style>

      {/* CARD */}
      <div
        id="print-section"
        className="w-full max-w-4xl bg-white shadow-md rounded-xl p-10"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10 border-b pb-6">

          <div className="flex items-center gap-4">
            <Image src="/logo.jpeg" alt="logo" width={70} height={40} />
            <h1 className="text-xl font-semibold text-black tracking-wide">
              POIESIS ART GALLERY
            </h1>
          </div>

          <div className="text-right text-sm text-gray-700">
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Date:</strong> {orderDate}</p>
          </div>

        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-medium text-black mb-10 text-center">
          Thank you for your purchase
        </h2>
<p className="text-sm text-gray-700 mt-2">
  Confirmation email and WhatsApp updates will be shared shortly.
</p>
        {/* CUSTOMER */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="border rounded-lg p-5">
            <h3 className="text-sm text-gray-600 mb-2">Customer Details</h3>
            <p className="font-semibold text-black">{shipping?.name}</p>
            <p className="text-sm text-gray-700">{shipping?.email}</p>
            <p className="text-sm text-gray-700">{shipping?.phone}</p>
          </div>

          <div className="border rounded-lg p-5">
            <h3 className="text-sm text-gray-600 mb-2">Shipping Address</h3>
            <p className="text-sm text-black">
              {shipping?.address}, {shipping?.city}, {shipping?.state}
            </p>
            <p className="text-sm text-black">
              {shipping?.pincode}
            </p>
          </div>

        </div>

        {/* ITEMS */}
        <div className="mb-10">

          <div className="grid grid-cols-4 text-sm font-medium text-gray-700 border-b pb-3 mb-3">
            <p>Artwork</p>
            <p>Qty</p>
            <p>Price</p>
            <p className="text-right">Total</p>
          </div>

          {orderItems.map((item: any) => {

            const price = Number(item.price.replace(/[^0-9]/g, ""))
            const qty = item.quantity || 1

            return (
              <div key={item.id} className="grid grid-cols-4 py-3 text-sm border-b">

                <p className="font-medium text-black">{item.title}</p>
                <p className="text-gray-800">{qty}</p>
                <p className="text-gray-800">₹{price}</p>
                <p className="text-right text-black font-medium">₹{price * qty}</p>

              </div>
            )
          })}

          <div className="text-right mt-6 text-lg font-semibold text-black">
            Total: ₹{totalAmount}
          </div>

        </div>

        {/* PAYMENT */}
        <div className="border rounded-lg p-5 mb-10">

          <h3 className="text-sm text-gray-600 mb-2">Payment Completed</h3>
          <p className="text-sm text-black">
            Payment ID: {payment?.paymentId}
          </p>

        </div>

        {/* NOTE */}
        <p className="text-sm font-bold text-blue-800 leading-relaxed text-center max-w-2xl mx-auto">
          *In case of any problem with the product delivered, contact us via email with video proof of unboxing.
          The video must clearly show the shipping label and all packed sides before opening.
        </p>

      </div>

      {/* BUTTON BELOW CARD */}
      <button
        onClick={() => window.print()}
        className="mt-10 font-bold bg-black text-white px-6 py-3 rounded-full hover:bg-yellow-400 hover:text-black transition"
      >
        Download Receipt
      </button>

    </main>

  )

}