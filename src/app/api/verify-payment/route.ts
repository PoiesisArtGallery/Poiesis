import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"
import twilio from "twilio"   
const resend = new Resend(process.env.RESEND_API_KEY!)
  const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)
export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = body

    // ✅ VERIFY SIGNATURE
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex")

    // ❌ PAYMENT FAILED
    if (generatedSignature !== razorpay_signature) {

      return NextResponse.json(
        {
          success: false,
          message: "Payment failed"
        },
        { status: 400 }
      )
    }

    // ✅ SAVE ORDER
    const { error } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          payment_status: "Paid",
          status: "Processing"
        }
      ])

    if (error) {
      console.error(error)
    }

    // ✅ UPDATE ARTWORK STATUS
    for (const item of orderData.items) {

      if (
        item.category !== "Graphics / Printmaking" &&
        item.category !== "Limited Edition"
      ) {

        await supabase
          .from("artworks")
          .update({
            status: "Out of Stock"
          })
          .eq("id", item.id)
      }
    }

    // ✅ CUSTOMER EMAIL
    try {

      await resend.emails.send({

        from: "Poiesis Art Gallery <onboarding@resend.dev>",

        to: orderData.email,

        subject: "Payment Successful - POIESIS ART GALLERY",

        html: `
          <h2>Payment Successful ✅</h2>

          <p>Dear ${orderData.customer_name},</p>

          <p>
            Thank you for your purchase from POIESIS ART GALLERY.
          </p>

          <h3>Order Details</h3>

          <p><strong>Order ID:</strong> ${razorpay_order_id}</p>

          <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>

          <p><strong>Total:</strong> ₹${orderData.total}</p>

          <h3>Items Purchased</h3>

          <ul>
            ${orderData.items.map((item: any) =>
              `<li>${item.title}</li>`
            ).join("")}
          </ul>

          <p>
            Your order is now being processed.
          </p>

          <p>
            Tracking details will be shared once shipped.
          </p>

          <br/>

          <p>
            POIESIS ART GALLERY
          </p>
        `
      })

    } catch (emailError) {

      console.error("Customer email failed:", emailError)
    }
     // ✅ CUSTOMER WHATSAPP
try {

  await client.messages.create({

    from: process.env.TWILIO_WHATSAPP_NUMBER!,

    to: `whatsapp:${orderData.phone}`,

    body: `
Payment Successful ✅

POIESIS ART GALLERY

Order ID:
${razorpay_order_id}

Amount:
₹${orderData.total}

Your order is being processed.

Thank you for your purchase.
    `
  })

} catch (whatsappError) {

  console.error(
    "Customer WhatsApp failed:",
    whatsappError
  )
}

    // ✅ ADMIN EMAIL ALERT
    try {

      await resend.emails.send({

        from: "Poiesis Art Gallery <onboarding@resend.dev>",

        to: "manishbarnwal925@gmail.com",

        subject: "New Order Received 🎨",

        html: `
          <h2>New Order Received</h2>

          <p><strong>Customer:</strong> ${orderData.customer_name}</p>

          <p><strong>Email:</strong> ${orderData.email}</p>

          <p><strong>Phone:</strong> ${orderData.phone}</p>

          <p><strong>Total:</strong> ₹${orderData.total}</p>

          <p><strong>Order ID:</strong> ${razorpay_order_id}</p>

          <h3>Items</h3>

          <ul>
            ${orderData.items.map((item: any) =>
              `<li>${item.title}</li>`
            ).join("")}
          </ul>
        `
      })

    } catch (adminEmailError) {

      console.error(
        "Admin notification failed:",
        adminEmailError
      )
    }

    // ✅ ADMIN WHATSAPP ALERT
try {

  await client.messages.create({

    from: process.env.TWILIO_WHATSAPP_NUMBER!,

    to: process.env.ADMIN_WHATSAPP!,

    body: `
🎨 New Order Received

Customer:
${orderData.customer_name}

Amount:
₹${orderData.total}

Items:
${orderData.items.map((i: any) => i.title).join(", ")}
    `
  })

} catch (adminWhatsappError) {

  console.error(
    "Admin WhatsApp failed:",
    adminWhatsappError
  )
}
    // ✅ SUCCESS RESPONSE
    return NextResponse.json({
      success: true
    })

  } catch (error: any) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    )
  }
}