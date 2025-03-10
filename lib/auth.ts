import { AuthOptions } from "next-auth"
import type { DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import UserModel from "@/models/User"

declare module "next-auth" {
  interface Session {
    user: {
      username: string
    } & DefaultSession["user"]
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Lütfen tüm alanları doldurun')
          }

          await connectDB()
          const user = await UserModel.findOne({ email: credentials.email }).select('+password')

          if (!user) {
            throw new Error('Kullanıcı bulunamadı')
          }

          if (!user.isEmailVerified) {
            throw new Error('Lütfen önce e-posta adresinizi doğrulayın')
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordCorrect) {
            throw new Error('Şifre yanlış')
          }

          return {
            id: user._id.toString(),
            name: user.name || "",
            email: user.email,
            username: user.username,
            image: user.profileImage || ""
          }
        } catch (error: any) {
          console.error('Giriş hatası:', error)
          throw new Error(error.message)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 gün
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
} 