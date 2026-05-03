"use client"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cartStore"
import { getImageUrl } from "@/lib/getImage"
export default function CartPage() {
const router = useRouter()
  const items = useCartStore((state) => state.items)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)

  const isMultiAllowed = (category: string) => {
    return (
      category === "Prints" ||
      category === "Graphics / Printmaking" ||
      category === "Limited Edition"
    )
  }

  const total = items.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9]/g, ""))
    const quantity = item.quantity || 1
    return sum + price * quantity
  }, 0)

  return (

    <main className="px-10 py-16">
{/* 🔥 ANIMATED DIVIDER */}
      <div className="divider mb-4" />
      <h1 className="text-4xl font-heading underline mb-10">
        Shopping Cart
      </h1>

      {items.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      <div className="space-y-6">

        {items.map((item) => {

          const price = Number(item.price.replace(/[^0-9]/g, ""))
          const quantity = item.quantity || 1
          const subtotal = price * quantity
          const allowMultiple = isMultiAllowed(item.category)

          return (
            
<div key={item.id} className="flex gap-6 border rounded-[15px] px-5 py-5 w-[40%]">

              <img
  src={getImageUrl(item.image, "artworks")}
  className="w-[150px] h-[150px] object-cover rounded-[20px] cursor-pointer"
/>

              <div>

                <h2 className="font-art text-lg font-bold">
                  {item.title}
                </h2>

                <p className="text-blue-800">
                  ₹{price}
                </p>

                {/* Quantity Section */}

                {allowMultiple ? (

                  <div className="flex items-center gap-3 mt-2">

                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="border px-2"
                    >
                      -
                    </button>

                    <span>{quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="border px-2"
                    >
                      +
                    </button>

                  </div>

                ) : (

                  <p className="mt-2 text-sm">
                    Quantity: 1
                  </p>

                )}

                {/* Subtotal */}

                <p className="mt-2 text-sm">
                  Subtotal: ₹{subtotal}
                </p>

                {/* Remove */}

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>

              </div>

            </div>
       
          )

        })}

      </div>
{/* 🔥 ANIMATED DIVIDER */}
      <div className="divider mt-6 mb-2" />

      {/* Total Section */}

      {items.length > 0 && (

        <div className="mt-10 border-t pt-6">

          <h2 className="text-xl font-bold mb-4">
            Total: ₹{total}
          </h2>

          <button
  onClick={() => router.push("/checkout")}
  className="bg-black text-white font-bold border rounded-[20px] px-4 py-2 hover:bg-yellow-400 hover:text-black transition"
>
  Proceed to Checkout
</button>

        </div>

      )}

    </main>

  )

}