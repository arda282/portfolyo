import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function PUT(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const data = await req.json()
    console.log('Gelen güncelleme verisi:', data)

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Güncellenebilir alanları kontrol et ve güncelle
    if (data.name !== undefined) user.name = data.name
    if (data.bio !== undefined) user.bio = data.bio
    if (data.location !== undefined) user.location = data.location
    if (data.website !== undefined) user.website = data.website
    if (data.profileImage !== undefined) user.profileImage = data.profileImage
    if (data.socialLinks !== undefined) user.socialLinks = data.socialLinks
    if (data.backgroundColor !== undefined) user.backgroundColor = data.backgroundColor

    console.log('Güncellenmiş kullanıcı verisi:', user)
    await user.save()

    // Güncellenmiş kullanıcı bilgilerini döndür
    const updatedUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      profileImage: user.profileImage,
      backgroundColor: user.backgroundColor,
      socialLinks: user.socialLinks,
      posts: user.posts
    }

    console.log('Döndürülen veri:', updatedUser)
    return NextResponse.json({
      message: "Profil güncellendi",
      user: updatedUser
    })
  } catch (error: any) {
    console.error("Profil güncelleme hatası:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu", details: error.message },
      { status: 500 }
    )
  }
} 