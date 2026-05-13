import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      name,
      place,
      type,
      phone,
      email,
      message,
      artwork,
      artist,
      images
    } = body

    // ✅ ADMIN EMAIL
    await resend.emails.send({

      from: "Poiesis Art Gallery <onboarding@resend.dev>",

      to: "manishbarnwal925@gmail.com",

      subject: artwork
        ? `New inquiry about artwork: ${artwork}`
        : "New Inquiry Received",

      html: `
        <h2>New Inquiry Received 🎨</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Phone:</strong> ${phone}</p>

        <p><strong>Place:</strong> ${place}</p>

        <p><strong>Type:</strong> ${type}</p>

        ${
          artwork
            ? `<p><strong>Artwork:</strong> ${artwork}</p>`
            : ""
        }

        ${
          artist
            ? `<p><strong>Artist:</strong> ${artist}</p>`
            : ""
        }

        <p><strong>Message:</strong></p>

        <p>${message}</p>

        ${
          images?.length
            ? `
              <h3>Reference Images</h3>

              ${images.map((img: string) =>
                `<p><a href="${img}">${img}</a></p>`
              ).join("")}
            `
            : ""
        }
      `
    })

    // ✅ CUSTOMER CONFIRMATION EMAIL
    await resend.emails.send({

      from: "Poiesis Art <onboarding@resend.dev>",

      to: email,

      subject: "Inquiry Registered - POIESIS ART GALLERY",

      html: `
        <h2>Inquiry Registered ✅</h2>

        <p>Hello ${name},</p>

        <p>
          Thank you for contacting POIESIS ART GALLERY.
        </p>

        <p>
          Your inquiry has been successfully registered.
        </p>

        ${
          artwork
            ? `
              <p>
                <strong>Artwork:</strong>
                ${artwork}
              </p>
            `
            : ""
        }

        <p>
          Our representatives will contact you soon.
        </p>

        <br/>

        <p>
          POIESIS ART GALLERY
        </p>
      `
    })
// ✅ NTFY INQUIRY ALERT
try {

  await fetch(
    "https://ntfy.sh/poiesis-admin-alerts",
    {

      method: "POST",

      headers: {

        Title: "New Inquiry Received",

        Priority: "urgent",

        Tags: "art,mailbox"
      },

      body: `
🎨 NEW INQUIRY RECEIVED

Customer:
${name}

Email:
${email}

Phone:
${phone}

Place:
${place}

Inquiry Type:
${type}

Artwork:
${artwork || "N/A"}

Artist:
${artist || "N/A"}

Message:
${message}
      `
    }
  )

} catch (ntfyError) {

  console.error(
    "NTFY INQUIRY ALERT FAILED:",
    ntfyError
  )
}

    return NextResponse.json({
      success: true
    })

  } catch (error: any) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}