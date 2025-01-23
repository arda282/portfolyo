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

    const { postId, content, caption } = await req.json()

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Postu bul ve güncelle
    const post = user.posts.id(postId)
    if (!post) {
      return NextResponse.json(
        { error: "Post bulunamadı" },
        { status: 404 }
      )
    }

    if (post.type === 'text') {
      post.content = content
    }
    post.caption = caption

    await user.save()

    return NextResponse.json({
      message: "Post güncellendi",
      post
    })
  } catch (error) {
    console.error("Post güncelleme hatası:", error)
    return NextResponse.json(
      { error: "Post güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 