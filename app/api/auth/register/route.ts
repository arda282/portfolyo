import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { sendVerificationEmail } from "@/lib/mail"

let isConnected = false

export async function POST(req: Request) {
  try {
    console.log("Kayıt işlemi başlatıldı")
    const { name, username, email, password } = await req.json()

    // Zorunlu alanları kontrol et
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanları doldurun" },
        { status: 400 }
      )
    }

    // Veritabanı bağlantısını kontrol et
    if (!isConnected) {
      console.log("Veritabanına bağlanılıyor...")
      await connectDB()
      isConnected = true
      console.log("Veritabanı bağlantısı başarılı")
    }

    // Kullanıcı adı veya email ile kayıtlı kullanıcı var mı kontrol et
    console.log("Mevcut kullanıcı kontrolü yapılıyor...")
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "Bu kullanıcı adı zaten kullanılıyor" },
          { status: 400 }
        )
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Bu email adresi zaten kayıtlı" },
          { status: 400 }
        )
      }
    }

    // Şifreyi hashle
    console.log("Şifre hashleniyor...")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Doğrulama tokeni oluştur
    console.log("Doğrulama tokeni oluşturuluyor...")
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat

    // Yeni kullanıcı oluştur
    console.log("Yeni kullanıcı oluşturuluyor...")
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
      isEmailVerified: false
    })

    console.log("Kullanıcı veritabanına kaydediliyor...")
    await newUser.save()

    // Doğrulama e-postası gönder
    console.log("Doğrulama e-postası gönderiliyor...")
    try {
      await sendVerificationEmail(email, verificationToken)
      console.log("Doğrulama e-postası gönderildi")
    } catch (emailError) {
      console.error("E-posta gönderme hatası:", emailError)
      // E-posta gönderilemese bile kullanıcı kaydını tamamla
    }

    console.log("Kayıt işlemi tamamlandı")
    return NextResponse.json({
      message: "Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.",
      user: {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error: any) {
    console.error("Kayıt hatası:", error)
    return NextResponse.json(
      { 
        error: "Kayıt sırasında bir hata oluştu", 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
} 