import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"
   
const resend = new Resend(process.env.RESEND_API_KEY!)
 
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

  console.error("ORDER INSERT ERROR:", error)

  return NextResponse.json(
    {
      success: false,
      message: error.message
    },
    { status: 500 }
  )
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

        from: "Poiesis Art Gallery <onboarding@poiesisartgallery.com>",

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
     

    // ✅ ADMIN EMAIL ALERT
    try {

      await resend.emails.send({

        from: "Poiesis Art Gallery <onboarding@poiesisartgallery.com>",

        to: "poiesis.art.gallery.pag@gmail.com",

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

   // ✅ NTFY ORDER ALERT
try {

  await fetch(
    "https://ntfy.sh/poiesis-admin-alerts",
    {

      method: "POST",

      headers: {

        Title: "New Order Received",

        Priority: "urgent",

        Tags: "shopping_cart,money"
      },

      body: `
🎨 NEW ORDER RECEIVED

Customer:
${orderData.customer_name}

Email:
${orderData.email}

Phone:
${orderData.phone}

Address:
${orderData.address}

Items:
${orderData.items.map((i: any) =>
  `${i.title} (${i.artist || "Unknown Artist"})`
).join(", ")}

Total:
₹${orderData.total}

Payment ID:
${razorpay_payment_id}

Order ID:
${razorpay_order_id}

Status:
Paid
      `
    }
  )

} catch (ntfyError) {

  console.error(
    "NTFY ORDER ALERT FAILED:",
    ntfyError
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