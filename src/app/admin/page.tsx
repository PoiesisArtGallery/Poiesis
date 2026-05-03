"use client"

import Link from "next/link"

export default function AdminPage() {

  return (

    <main className="px-10 py-16">

      <h1 className="text-3xl font-bold underline mb-10">Admin Panel</h1>

      <div className="flex gap-6">

        <Link
          href="/admin/new-entry"
          className="border rounded-[50] text-blue-900 font-bold px-6 py-3"
        >
          New Entry
        </Link>

        <Link
          href="/admin/modify"
          className="border rounded-[50] text-blue-900 font-bold px-6 py-3"
        >
          Modify Entry
        </Link>
<Link href="/admin/homepage"
className="border rounded-[50] text-blue-900 font-bold px-6 py-3"
        >
  Homepage Sections
</Link>
<Link href="/admin/modify-homepage"
className="border rounded-[50] text-blue-900 font-bold px-6 py-3"
        >
  Modify Homepage Sections
</Link>


 

  {/* ✅ ADD THESE */}

  <Link href="/admin/orders">
    <button className="border rounded-[50] text-blue-900 font-bold px-6 py-3">
      Order History
    </button>
  </Link>

  <Link href="/admin/inquiries">
    <button className="border rounded-[50] text-blue-900 font-bold px-6 py-3">
      Inquiries
    </button>
  </Link>

</div>
      
      
 
    </main>

  )
}