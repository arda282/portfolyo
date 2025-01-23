import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const data = await req.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: "Dosya yüklenemedi" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını benzersiz yap
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const path = join(process.cwd(), "public/uploads", filename)

    // Dosyayı kaydet
    await writeFile(path, buffer)

    // Dosyanın URL'sini döndür
    const fileUrl = `/uploads/${filename}`

    return NextResponse.json({
      message: "Dosya başarıyla yüklendi",
      url: fileUrl
    })
  } catch (error) {
    console.error("Dosya yükleme hatası:", error)
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 