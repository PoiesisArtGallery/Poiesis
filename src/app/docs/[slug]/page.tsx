"use client"

import { useParams } from "next/navigation"

export default function DocPage() {

  const params = useParams()

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug

  if (!slug) {
    return <div>Loading...</div>
  }

  const fileUrl = `/pdfs/${slug}.pdf`

  return (

    <main className="w-full h-screen">

      <div className="p-4 text-center border-b">
        <h1 className="text-lg font-medium">
          {slug}
        </h1>
      </div>

      <iframe
        src={fileUrl}
        className="w-full h-[90vh]"
      />

    </main>

  )
}