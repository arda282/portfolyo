"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 right-0 p-4">
      {!session?.user && (
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-[#629584] hover:bg-[#4a7164] rounded-lg text-white transition-colors duration-200"
        >
          Giriş Yap
        </Link>
      )}
    </nav>
  )
} 