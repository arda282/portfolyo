import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#629584] to-[#243642] text-white px-4">
      <h2 className="text-4xl font-bold mb-4">Sayfa Bulunamadı</h2>
      <p className="text-gray-400 mb-8">Aradığınız sayfa mevcut değil.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#629584] hover:bg-[#4a7164] rounded-xl transition-colors duration-200"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
} 