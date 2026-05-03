"use client"

import { useCartStore } from "@/store/cartStore"
import { useEffect } from "react"
import emailjs from "emailjs-com"

export default function PaymentPage() {

  const items = useCartStore((state) => state.items)

  const total = items.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9]/g, ""))
    const quantity = item.quantity || 1
    return sum + price * quantity
  }, 0)

  useEffect(() => {

    const loadRazorpay = async () => {

      const res = await fetch("/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: total })
      })

      const order = await res.json()

      const shipping = JSON.parse(localStorage.getItem("shipping") || "{}")

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "POIESIS ART GALLERY",
        description: "Artwork Purchase",
        order_id: order.id,

        handler: async function (response: any) {

          const orderId = "PAG-" + Date.now()
localStorage.setItem("orderItems", JSON.stringify(items))
          // ✅ Save payment info
          localStorage.setItem("payment", JSON.stringify({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
          }))
// ✅ SAVE ITEMS HERE
  localStorage.setItem("orderItems", JSON.stringify(items))

  window.location.href = "/checkout/success"
          // 📨 SEND EMAIL
          try {

            await emailjs.send(
              "service_b90e3xl",
              "template_21rksnb",
              {
                name: shipping.name,
                email: shipping.email,
                order_id: orderId,
                payment_id: response.razorpay_payment_id,
                items: items.map(i => i.title).join(", "),
                total: total
              },
              "4zmqOnHAlm2a9dj3z"
            )

          } catch (err) {
            console.error("Email failed:", err)
          }

          // ✅ Redirect
          window.location.href = "/checkout/success"
        },

        prefill: {
          name: shipping.name,
          email: shipping.email
        },

        theme: {
          color: "#000000"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = loadRazorpay
    document.body.appendChild(script)

  }, [])

  return (
    <div className="text-center mt-20">
      Processing Payment...
    </div>
  )

}