import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const { postId } = await req.json()

    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Postu bul ve sil
    await user.updateOne({ $pull: { posts: { _id: postId } } })
    await user.save()

    return NextResponse.json({ message: "Post silindi" })
  } catch (error) {
    console.error("Post silme hatası:", error)
    return NextResponse.json(
      { error: "Post silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 