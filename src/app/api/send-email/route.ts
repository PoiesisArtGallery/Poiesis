import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {

  const { email } = await req.json()

  try {

    await resend.emails.send({
      from: "Poiesis Art Gallery <onboarding@poiesisartgallery.com>",
      to: email,
      subject: "Welcome to Poiesis Art Gallery 🎨",
      html: `
        <h2>Welcome to Poiesis Art Gallery</h2>
        <p>Thank you for subscribing.</p>
        <p>You will now receive updates about new artworks, exhibitions and exclusive offers.</p>
      `
    })

    return Response.json({ success: true })

  } catch (error) {
    return Response.json({ error })
  }

}