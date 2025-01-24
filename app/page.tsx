"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#629584] to-[#243642] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Müzik ve Düşüncelerinizi Paylaşın
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl">
          Spotify müziklerinizi ve düşüncelerinizi paylaşabileceğiniz modern bir platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-[#ffb829] hover:bg-[#e6a625] text-black font-semibold rounded-xl transition-colors duration-200 text-center"
          >
            Hemen Başla
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 font-semibold rounded-xl transition-colors duration-200 text-center"
          >
            Giriş Yap
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800/30 rounded-2xl hover:bg-gray-800/40 transition-colors duration-200">
            <h3 className="text-2xl font-semibold mb-4">🎵 Müzik Paylaşımı</h3>
            <p className="text-gray-300">
              Spotify entegrasyonu ile sevdiğiniz şarkıları profilinizde paylaşın ve müzik zevkinizi yansıtın.
            </p>
          </div>
          <div className="p-6 bg-gray-800/30 rounded-2xl hover:bg-gray-800/40 transition-colors duration-200">
            <h3 className="text-2xl font-semibold mb-4">💭 Düşünce Paylaşımı</h3>
            <p className="text-gray-300">
              Düşüncelerinizi, deneyimlerinizi ve yaratıcı içeriklerinizi toplulukla paylaşın.
            </p>
          </div>
          <div className="p-6 bg-gray-800/30 rounded-2xl hover:bg-gray-800/40 transition-colors duration-200">
            <h3 className="text-2xl font-semibold mb-4">🔗 Sosyal Bağlantılar</h3>
            <p className="text-gray-300">
              Tüm sosyal medya hesaplarınızı tek bir profilde birleştirin ve erişilebilirliğinizi artırın.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gray-800/30 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Hemen Katılın
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Siz de bu yaratıcı topluluğun bir parçası olun ve kendi dijital varlığınızı oluşturun.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-[#ffb829] hover:bg-[#e6a625] text-black font-semibold rounded-xl transition-colors duration-200"
          >
            Ücretsiz Hesap Oluştur
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>© 2024 Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}