"use client"

export default function GalleryFilter({ categories }: any) {

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (

    <div className="flex flex-wrap justify-center gap-2 mb-12 text-sm">

      {/* ALL */}
      <button
        onClick={() => scrollToSection("top")}
        className="px-2 text-lg text-purple-900 font-bold hover:text-black hover:underline"
      >
        Home
      </button>

      {categories.map((cat: string, i: number) => (

        <span key={i} className="flex items-center gap-2">

          <span className="text-gray-400">/</span>

          <button
            onClick={() => scrollToSection(cat)}
            className="px-2 text-[15px] text-purple-900 font-bold hover:text-black hover:underline"
          >
            {cat}
          </button>

        </span>

      ))}

    </div>

  )

}