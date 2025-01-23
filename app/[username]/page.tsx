import { notFound } from "next/navigation"
import connectDB from "@/lib/mongodb"
import UserModel from "@/models/User"
import ProfilePage from "@/components/profile-page"

interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  github?: string
  youtube?: string
  twitch?: string
  discord?: string
}

interface User {
  name: string
  username: string
  email: string
  profileImage?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: SocialLinks
  posts: any[]
}

export default async function UserProfilePage({
  params
}: {
  params: { username: string }
}) {
  await connectDB()

  const user = await UserModel.findOne({ username: params.username })

  if (!user) {
    notFound()
  }

  const userData: User = {
    name: user.name,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage || undefined,
    bio: user.bio || undefined,
    location: user.location || undefined,
    website: user.website || undefined,
    socialLinks: user.socialLinks ? {
      facebook: user.socialLinks.facebook || undefined,
      instagram: user.socialLinks.instagram || undefined,
      twitter: user.socialLinks.twitter || undefined,
      linkedin: user.socialLinks.linkedin || undefined,
      github: user.socialLinks.github || undefined,
      youtube: user.socialLinks.youtube || undefined,
      twitch: user.socialLinks.twitch || undefined,
      discord: user.socialLinks.discord || undefined
    } : undefined,
    posts: user.posts || []
  }

  return <ProfilePage user={userData} />
} 