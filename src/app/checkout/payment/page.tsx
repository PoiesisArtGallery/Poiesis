"use client"

import { useCartStore } from "@/store/cartStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PaymentPage() {

  const router = useRouter()

  const items = useCartStore((state) => state.items)

  const total = items.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9]/g, ""))
    const quantity = item.quantity || 1
    return sum + price * quantity
  }, 0)

  useEffect(() => {

    const loadRazorpay = async () => {

      try {

        // ✅ CREATE ORDER
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ amount: total })
        })

        const order = await res.json()

        if (!order.id) {
          alert("Unable to create payment order")
          return
        }

        const shipping = JSON.parse(
          localStorage.getItem("shipping") || "{}"
        )

        const orderData = {
          customer_name: shipping.name,
          email: shipping.email,
          phone: shipping.phone,
          address: shipping.address,
          items,
          total
        }

        const options: any = {

          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount: order.amount,
          currency: "INR",

          name: "POIESIS ART GALLERY",

          description: "Artwork Purchase",

          order_id: order.id,

          // ✅ SUCCESS HANDLER
          handler: async function (response: any) {

            try {

              // ✅ VERIFY PAYMENT
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  ...response,
                  orderData
                })
              })

              const verifyData = await verifyRes.json()

              // ✅ SUCCESS
              if (verifyData.success) {

                localStorage.setItem(
                  "payment",
                  JSON.stringify({
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id
                  })
                )

                localStorage.setItem(
                  "orderItems",
                  JSON.stringify(items)
                )

                router.push("/checkout/success")

              } else {

                alert("Payment failed, try again")

                router.push("/checkout/failed")
              }

            } catch (err) {

              console.error(err)

              alert("Payment verification failed")

              router.push("/checkout/failed")
            }
          },

          // ✅ PAYMENT FAILED
          modal: {
            ondismiss: function () {
              alert("Payment cancelled")
              router.push("/checkout/failed")
            }
          },

          prefill: {
            name: shipping.name,
            email: shipping.email,
            contact: shipping.phone
          },

          theme: {
            color: "#000000"
          }
        }

        const rzp = new (window as any).Razorpay(options)

        // ✅ PAYMENT FAILED EVENT
        rzp.on("payment.failed", function () {

          alert("Payment failed, try again")

          router.push("/checkout/failed")
        })

        rzp.open()

      } catch (error) {

        console.error(error)

        alert("Something went wrong")

        router.push("/checkout/failed")
      }
    }

    // ✅ LOAD RAZORPAY SCRIPT
    const script = document.createElement("script")

    script.src = "https://checkout.razorpay.com/v1/checkout.js"

    script.onload = loadRazorpay

    document.body.appendChild(script)

  }, [])

  return (

    <div className="text-center mt-20 text-xl font-bold border rounded-lg p-10">

      Processing Payment...

    </div>
  )
}