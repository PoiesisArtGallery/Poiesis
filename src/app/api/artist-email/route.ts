import { Resend } from "resend"

// ✅ Force Node runtime (IMPORTANT for Resend on Vercel)
export const runtime = "nodejs"

export async function POST(req: Request) {

  try {

    // ✅ Parse safely
    const body = await req.json()

    const { name, work, phone, email } = body

    // ✅ Basic validation (prevents crashes)
    if (!name || !email) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // ✅ Ensure API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY")
      return Response.json(
        { error: "Server config error" },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: "Poiesis Art <onboarding@resend.dev>",
      to: "manishbarnwal925@gmail.com",
      subject: "New Artist Application 🎨",
      html: `
        <h2>New Artist Application</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Work:</strong> ${work || "-"}</p>
        <p><strong>Phone:</strong> ${phone || "-"}</p>
        <p><strong>Email:</strong> ${email}</p>
      `
    })

    return Response.json({ success: true })

  } catch (err: any) {

    console.error("Email Error:", err)

    return Response.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    )
  }
}