"use client"

import { useCartStore } from "@/store/cartStore"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {

  const items = useCartStore((state) => state.items)
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: ""
  })

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: any) => {

  e.preventDefault()

  if (items.length === 0) {

    alert("Cart is empty")

    return
  }

  // ✅ TRIM VALUES
  const trimmedForm = {

    name: form.name.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.trim(),
    phone: form.phone.trim(),
    email: form.email.trim()
  }

  // ✅ EMPTY CHECK
  for (const key in trimmedForm) {

    if (!trimmedForm[key as keyof typeof trimmedForm]) {

      alert("Please fill all fields")

      return
    }
  }

  // ✅ PHONE VALIDATION
  if (!/^[6-9]\d{9}$/.test(trimmedForm.phone)) {

    alert("Enter valid 10-digit Indian mobile number")

    return
  }

  // ✅ PINCODE VALIDATION
  if (!/^\d{6}$/.test(trimmedForm.pincode)) {

    alert("Enter valid 6-digit pincode")

    return
  }

  // ✅ EMAIL VALIDATION
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      trimmedForm.email
    )
  ) {

    alert("Enter valid email address")

    return
  }

  // ✅ SAVE
  localStorage.setItem(
    "shipping",
    JSON.stringify(trimmedForm)
  )

  router.push("/checkout/summary")
}

  return (

    <main className="px-6 md:px-10 py-16 max-w-xl mx-auto">

      <h1 className="text-4xl font-heading underline mb-10 text-center">
        Shipping Details
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="Full Name" required onChange={handleChange} className="w-full border rounded-[20px] p-2" />
        <input name="address" placeholder="Address" required onChange={handleChange} className="w-full border rounded-[20px] p-2" />
        <input name="city" placeholder="City" required onChange={handleChange} className="w-full border rounded-[20px] p-2" />
        <input name="state" placeholder="State" required onChange={handleChange} className="w-full border rounded-[20px] p-2" />
        <input name="pincode" placeholder="Pincode" required onChange={handleChange} className="w-full border rounded-[20px] p-2" />
        <input name="phone" placeholder="Phone(10 digits without +91 or 0)" required onChange={handleChange} className="w-full border rounded-[20px] p-2" />
        <input name="email" placeholder="Email" required onChange={handleChange} className="w-full border rounded-[20px]  p-2" />

        {/* 🚚 SHIPPING NOTE */}
        <p className="text-sm text-blue-800 font-bold">
          Order tracking details will be available within 3–4 days (domestic) and 6–7 days (international deliveries).
        </p>

        <button className="mx-50 font-bold bg-black text-white px-3 py-2 rounded-[15px] hover:bg-yellow-400 hover:text-black transition">
          Continue
        </button>

      </form>

    </main>

  )

}