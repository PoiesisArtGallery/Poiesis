import { create } from "zustand"
import { persist } from "zustand/middleware"

type CartItem = {
  id: number
  title: string
  price: string
  image: string
  category: string
  quantity?: number
  
}

type CartState = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  
  persist(
    (set) => ({
      items: [],
clearCart: () => set({ items: [] }),
      addToCart: (item) =>
        set((state) => {

          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id
          )

          if (existingItem) {

  if (
    item.category === "Prints" ||
    item.category === "Graphics / Printmaking" ||
    item.category === "Limited Edition"
  ) {

    alert("Quantity updated in cart")

    return {
      items: state.items.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
          : cartItem
      )
    }

  }

  alert("This artwork is already in your cart")

  return { items: state.items }

}
alert("Added to cart")         
return {
            items: [
              ...state.items,
              { ...item, quantity: 1 }
            ]
          }

        }),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
                : item
            )
        })),
    }),
    {
      name: "poiesis-cart",
    }
  )
)