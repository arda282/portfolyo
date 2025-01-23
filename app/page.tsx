"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) {
      // Kullanıcı giriş yapmışsa kendi profiline yönlendir
      router.push(`/${session.user.username}`)
    } else if (status === "unauthenticated") {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      router.push('/auth/login')
    }
  }, [session, status, router])

  return null
}