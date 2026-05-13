"use client"

import { useCartStore } from "@/store/cartStore"

import { imageConfigDefault } from "next/dist/shared/lib/image-config"
import Zoom from "react-medium-image-zoom"
import Link from "next/link"

import { getImageUrl } from "@/lib/getImage"
export default function ArtworkClient({ artwork }: any) {

  const addToCart = useCartStore((state) => state.addToCart)
const slug = artwork.artist
  ?.toLowerCase()
  .replace(/\s+/g, "-")
  .replace(/\./g, "")
  const handleAdd = () => {
    addToCart({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      image: artwork.image,
      category: artwork.category,
    })

    alert("Added to cart")
  }

  return (

    <main className="px-10 py-16">

      <div className="grid md:grid-cols-2 gap-16">

        {/* Artwork Image */}

        <Zoom>
          <img
            src={getImageUrl(artwork.image)}
            alt={artwork.title}
            className="h-[550px] w-full object-cover rounded-[15px] cursor-zoom-in"
          />
        </Zoom>


        {/* Artwork Details */}

        <div>

          <h1 className="text-4xl font-heading mb-3">
            {artwork.title}
          </h1>

          <p className="text-blue-900 font-bold font-art   text-xl mb-6">
            {artwork.artist}
          </p>


          {/* Artwork Information */}

          <div className="space-y-2 mb-6 text-sm">

            <p>
              <strong>Medium:</strong> {artwork.medium}
            </p>

            <p>
              <strong>Dimensions:</strong> {artwork.dimensions}
            </p>

            <p>
              <strong>Category:</strong> {artwork.category}
            </p>

          </div>


          


          {/* Price + Status */}

          <p className="text-lg mb-3">
            Price: ₹ {artwork.price}
          </p>

          <p className="mb-8">
            Status: {artwork.status}
          </p>


          {/* Buttons */}

          <div className="flex gap-4 mb-10">

  {/* ✅ IN STOCK → ADD TO CART */}
  {artwork.status === "In Stock" && (

    <button
      onClick={handleAdd}
      className="bg-black font-bold rounded-[15px] text-white px-6 py-2 hover:bg-yellow-400 hover:text-black transition"
    >
      Add to Cart   🛒
    </button>


  )}

  {/* ✅ MURALS / COMMISSION → INQUIRY */}
  {(artwork.category === "Murals" ||
    artwork.category === "Commission" ||
    artwork.status === "Available for Commission") && (

    <Link href="/inquiry">
      <button className="border font-bold rounded-[20px] px-6 py-2 hover:bg-black hover:text-white transition">
        Make Inquiry ℹ️
      </button>
    </Link>

  )}

  {/* ✅ OUT OF STOCK / EXHIBITION → REQUEST */}
  {(artwork.status === "Out of Stock" ||
    artwork.status === "Exhibition Only") && (

    <Link href="/inquiry">
      <button className="border rounded-[20px] px-6 py-2 hover:bg-black hover:text-white transition">
        Request Availability 🛎️
      </button>
    </Link>

  )}

</div>

           {/* Description */}

          <p className="mb-6 text-gray-700">
            {artwork.info}
          </p>
          
          {/* About Artist */}



<Link
  href={`/artists/${encodeURIComponent(
    artwork.artist
  )}`}
>
  <p className="border rounded-[20px] text-blue-600 text-sm px-4 py-1 font-bold inline-block hover:bg-black hover:text-white transition">
    About the Artist: {artwork.artist}
  </p>
</Link>

        </div>

      </div>
      
    </main>

  )

}