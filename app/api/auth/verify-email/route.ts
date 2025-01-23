import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: "Doğrulama tokeni gerekli" },
        { status: 400 }
      )
    }

    await connectDB()

    // Token ile kullanıcıyı bul
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş doğrulama tokeni" },
        { status: 400 }
      )
    }

    // Kullanıcıyı doğrulanmış olarak işaretle
    user.isEmailVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined
    await user.save()

    return NextResponse.json({
      message: "E-posta adresi başarıyla doğrulandı"
    })
  } catch (error: any) {
    console.error("E-posta doğrulama hatası:", error)
    return NextResponse.json(
      { error: "E-posta doğrulanırken bir hata oluştu" },
      { status: 500 }
    )
  }
} 