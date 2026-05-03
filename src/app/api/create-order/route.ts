import Razorpay from "razorpay"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { amount } = await req.json()

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
  })

  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: "order_rcptid_" + Math.random()
  }

  const order = await razorpay.orders.create(options)

  return NextResponse.json(order)
}