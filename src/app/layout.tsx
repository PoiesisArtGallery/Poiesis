import "./globals.css"
import { Playfair_Display, Inter, Poppins, Geist } from "next/font/google"
import type { Metadata } from "next"
import "react-medium-image-zoom/dist/styles.css"
import Footer from "@/components/Footer"
import FloatingActions from "@/components/FloatingActions"
import Navbar from "../app/components/Navbar"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap"
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
  display: "swap"
})

export const metadata: Metadata = {
  title: "POIESIS ART GALLERY",
  description:
    "Premium Art Gallery showcasing original artworks, portraits, and creative expressions."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      

      {/* ✅ ONLY ONE BODY */}
      <body
      suppressHydrationWarning
        className={`
          ${playfair.variable}
          ${inter.variable}
          ${poppins.variable}
          ${geist.variable}
          bg-[#fafafa] text-black antialiased
        `}
      >
<p className="text-gray-500 mb-2">
              </p>

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main>
          {children}
        </main>

        {/* FLOATING BUTTONS */}
        <FloatingActions />

        <p className="text-gray-500 mb-5">
              </p>
<Footer/>
      </body>

    </html>
  )
}