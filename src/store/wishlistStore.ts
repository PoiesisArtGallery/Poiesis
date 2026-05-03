import { create } from "zustand"

interface WishlistItem {
  id: number
  title: string
  image: string
}

interface WishlistStore {
  items: WishlistItem[]
  toggleWishlist: (item: WishlistItem) => void
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({

  items: [],

  toggleWishlist: (item) => {

    const exists = get().items.find((i) => i.id === item.id)

    if (exists) {
      set({
        items: get().items.filter((i) => i.id !== item.id)
      })
    } else {
      set({
        items: [...get().items, item]
      })
    }

  }

}))