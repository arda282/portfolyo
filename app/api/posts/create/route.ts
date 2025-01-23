import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { rateLimit } from "@/middleware/rateLimit"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Rate limit kontrolü
    const rateLimitResult = await rateLimit(req, data.type === 'music' ? 'music' : 'post')
    if (rateLimitResult) return rateLimitResult

    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    console.log("Gelen post verisi:", data)
    
    // Post verilerini kontrol et
    if (!data.type || !['text', 'music'].includes(data.type)) {
      return NextResponse.json(
        { error: "Geçersiz post tipi" },
        { status: 400 }
      )
    }

    if (data.type === 'text' && !data.content?.trim()) {
      return NextResponse.json(
        { error: "Metin içeriği gerekli" },
        { status: 400 }
      )
    }

    if (data.type === 'music' && !data.spotifyTrackId) {
      return NextResponse.json(
        { error: "Spotify şarkı ID'si gerekli" },
        { status: 400 }
      )
    }

    await connectDB()

    // Kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    console.log("Kullanıcı bulundu:", user.email)

    // Yeni postu oluştur
    const newPost = {
      type: data.type,
      ...(data.type === 'text' ? { content: data.content } : {}),
      ...(data.type === 'music' ? { spotifyTrackId: data.spotifyTrackId } : {}),
      caption: data.caption || "",
      createdAt: new Date()
    }

    console.log("Oluşturulan post:", newPost)

    // Yeni postu ekle
    user.posts.unshift(newPost)

    // Değişiklikleri kaydet
    await user.save()
    console.log("Post başarıyla kaydedildi")

    return NextResponse.json({
      message: "Post oluşturuldu",
      post: newPost
    })
  } catch (error: any) {
    console.error("Post oluşturma hatası:", error)
    return NextResponse.json(
      { 
        error: "Bir hata oluştu", 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
} 