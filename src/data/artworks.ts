export type Artwork = {
  id: number
  title: string
  artist: string
  artistSlug: string
  image: string
  medium: string
  dimensions: string
  category: string
  price: string
  status: string
  likes: number
  commentsCount: number
  description: string
}

export const artworks: Artwork[] = [

  {
    id: 1,
    title: "Silent Landscape",
    artist: "A. Kumar",
    artistSlug: "a-kumar",
    image: "/artworks/silent-landscape.jpg",
    medium: "Oil on Canvas",
    dimensions: "24 x 36 inches",
    category: "Paintings",
    price: "₹12,000",
    status: "In Stock",
    likes: 1010,
commentsCount: 232,
    description:
      "A quiet landscape exploring depth and atmosphere through layered colour and tonal variation."
  },

  {
    id: 2,
    title: "Morning Light",
    artist: "A. Kumar",
    artistSlug: "a-kumar",
    image: "/artworks/morning-light.jpg",
    medium: "Oil on Canvas",
    dimensions: "30 x 40 inches",
    category: "Paintings",
    price: "₹15,000",
    status: "In Stock",
    likes: 101,
commentsCount: 21,
    description:
      "A soft atmospheric composition capturing early morning light."
  },

  {
    id: 3,
    title: "Urban Wall",
    artist: "S. Das",
    artistSlug: "s-das",
    image: "/artworks/urban-wall.jpg",
    medium: "Acrylic",
    dimensions: "Large Wall Mural",
    category: "Murals",
    price: "Commission",
    status: "Available for Commission",
    likes: 10,
commentsCount: 2,
    description:
      "A mural exploring urban rhythm and movement through bold colour structures."
  },
  
  {
    id: 4,
    title: "Radha Krishna",
    artist: "Rahul",
    artistSlug: "Rahul",
    image: "/artworks/print1.jpg",
    medium: "Acrylic",
    dimensions: "Large Wall print",
    category: "Graphics & Printmaking",
    price: "₹3879",
    status: "In Stock",
    likes: 9130,
commentsCount: 672,
    description:
      "Explore beautifully crafted Radha krishna art paintings to add divine charm to your home.."
  }

]