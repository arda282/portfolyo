import { NextResponse } from "next/server"

const SPOTIFY_API_URL = "https://api.spotify.com/v1"
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

async function getSpotifyAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Arama terimi gerekli" }, { status: 400 })
    }

    const accessToken = await getSpotifyAccessToken()

    const response = await fetch(
      `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data.tracks.items)
  } catch (error) {
    console.error("Spotify arama hatası:", error)
    return NextResponse.json(
      { error: "Spotify araması başarısız oldu" },
      { status: 500 }
    )
  }
} 