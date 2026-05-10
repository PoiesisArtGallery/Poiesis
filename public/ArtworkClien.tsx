<p className="text-gray-500 mb-20">
              </p>

git add .
git commit -m "small update"
git push


import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {

  const { name, work, phone, email } = await req.json()

  try {

    await resend.emails.send({
      from: "Poiesis Art <onboarding@resend.dev>",
      to: "manishbarnwal925@gmail.com", // 👈 PUT YOUR EMAIL HERE
      subject: "New Artist Application 🎨",
      html: `
        <h2>New Artist Application</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Work:</strong> ${work}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
      `
    })

    return Response.json({ success: true })

  } catch (error) {
    console.error(error)
    return Response.json({ error })
  }

}