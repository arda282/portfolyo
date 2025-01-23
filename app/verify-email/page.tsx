"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")
      
      if (!token) {
        toast.error("Doğrulama tokeni bulunamadı")
        setIsVerifying(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Doğrulama başarısız")
        }

        setIsSuccess(true)
        toast.success("E-posta adresiniz başarıyla doğrulandı")
      } catch (error: any) {
        toast.error(error.message || "Bir hata oluştu")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="w-full max-w-md space-y-8 bg-gray-800/50 p-8 rounded-2xl text-center">
      <h2 className="text-3xl font-bold">E-posta Doğrulama</h2>
      
      {isVerifying ? (
        <p className="text-gray-400">E-posta adresiniz doğrulanıyor...</p>
      ) : isSuccess ? (
        <>
          <p className="text-gray-400">E-posta adresiniz başarıyla doğrulandı!</p>
          <Link
            href="/auth/login"
            className="mt-4 inline-block px-6 py-3 bg-[#629584] hover:bg-[#4a7164] rounded-xl transition-colors duration-200"
          >
            Giriş Yap
          </Link>
        </>
      ) : (
        <>
          <p className="text-gray-400">Doğrulama başarısız oldu.</p>
          <Link
            href="/"
            className="mt-4 inline-block px-6 py-3 bg-[#629584] hover:bg-[#4a7164] rounded-xl transition-colors duration-200"
          >
            Ana Sayfaya Dön
          </Link>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#629584] to-[#243642] text-white p-4">
      <Suspense fallback={
        <div className="w-full max-w-md space-y-8 bg-gray-800/50 p-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold">E-posta Doğrulama</h2>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
} 