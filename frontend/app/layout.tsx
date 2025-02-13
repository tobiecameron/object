import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import dynamic from "next/dynamic"

const inter = Inter({ subsets: ["latin"] })

const DynamicModel3DViewer = dynamic(() => import("@/components/Model3DViewer").then((mod) => mod.Model3DViewer), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "Sanity Powered Website",
  description: "A website powered by Sanity and Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicModel3DViewer />
        <div className="content-wrapper">{children}</div>
      </body>
    </html>
  )
}

