import Razorpay from "razorpay"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const { amount } = await req.json()

    if (!amount) {
      return NextResponse.json(
        { error: "Amount required" },
        { status: 400 }
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    })

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now()
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)

  } catch (error: any) {

    console.error(error)

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}