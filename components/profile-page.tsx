"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Facebook, Github, Instagram, Edit, Plus, Upload, LogOut, MoreVertical, Trash, Edit2, Twitter, Linkedin, Youtube, Twitch, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  name: string
  username: string
  email: string
  profileImage?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    github?: string
    youtube?: string
    twitch?: string
    discord?: string
  }
  posts?: Array<{
    _id: string
    type: 'text' | 'music'
    url?: string
    content?: string
    caption?: string
    spotifyTrackId?: string
    createdAt: Date
  }>
}

interface ProfilePageProps {
  user: User
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const { data: session } = useSession()
  const isOwner = session?.user?.email === user.email
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newPost, setNewPost] = useState<{
    type: 'text' | 'music'
    content?: string
    spotifyTrackId?: string
    caption: string
  }>({
    type: 'text',
    content: '',
    caption: ''
  })

  const [spotifySearchQuery, setSpotifySearchQuery] = useState('')
  const [spotifySearchResults, setSpotifySearchResults] = useState<Array<{
    id: string
    name: string
    artists: Array<{ name: string }>
    album: { images: Array<{ url: string }> }
  }>>([])
  const [selectedTrack, setSelectedTrack] = useState<{
    id: string
    name: string
    artists: Array<{ name: string }>
    album: { images: Array<{ url: string }> }
  } | null>(null)

  const [editingPost, setEditingPost] = useState<{
    id: string
    content?: string
    caption: string
  } | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Dosya yüklenemedi")
      }

      const data = await response.json()
      
      // Profil resmini güncelle
      const updateResponse = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileImage: data.url }),
      })

      if (!updateResponse.ok) {
        throw new Error("Profil resmi güncellenemedi")
      }

      const updatedUser = await updateResponse.json()
      setEditedUser({ ...editedUser, profileImage: data.url })
      toast.success("Profil resmi güncellendi")
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      })

      if (!response.ok) {
        throw new Error('Profil güncellenemedi')
      }

      const data = await response.json()
      setEditedUser(data.user)
      toast.success('Profil güncellendi')
      setIsEditing(false)
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleAddPost = async () => {
    try {
      // Post verilerini kontrol et
      if (newPost.type === 'text' && !newPost.content?.trim()) {
        toast.error('Lütfen bir metin girin')
        return
      }

      if (newPost.type === 'music' && !newPost.spotifyTrackId) {
        toast.error('Lütfen bir şarkı seçin')
        return
      }

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Paylaşım yapılırken bir hata oluştu')
      }

      // State'i güncelle
      setEditedUser(prev => ({
        ...prev,
        posts: [data.post, ...(prev.posts || [])]
      }))

      // Formu temizle
      setNewPost({
        type: 'text',
        content: '',
        caption: ''
      })
      setSpotifySearchQuery('')
      setSpotifySearchResults([])
      setSelectedTrack(null)

      toast.success('Paylaşım yapıldı')
      setIsAddingPost(false)
    } catch (error: any) {
      console.error('Post ekleme hatası:', error)
      toast.error(error.message || 'Bir hata oluştu')
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  const handleSpotifySearch = async () => {
    if (!spotifySearchQuery.trim()) return

    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(spotifySearchQuery)}`)
      if (!response.ok) throw new Error('Arama başarısız oldu')
      
      const data = await response.json()
      setSpotifySearchResults(data)
    } catch (error) {
      toast.error('Spotify araması başarısız oldu')
    }
  }

  const handleTrackSelect = (track: any) => {
    setSelectedTrack(track)
    setNewPost({
      ...newPost,
      type: 'music',
      spotifyTrackId: track.id,
      caption: `${track.name} - ${track.artists[0].name}`
    })
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch('/api/posts/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      })

      if (!response.ok) {
        throw new Error('Post silinemedi')
      }

      setEditedUser(prev => ({
        ...prev,
        posts: prev.posts?.filter(post => post._id !== postId)
      }))

      toast.success('Post silindi')
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return

    try {
      const response = await fetch('/api/posts/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPost),
      })

      if (!response.ok) {
        throw new Error('Post güncellenemedi')
      }

      const data = await response.json()
      
      setEditedUser(prev => ({
        ...prev,
        posts: prev.posts?.map(post => 
          post._id === editingPost.id ? data.post : post
        )
      }))

      setEditingPost(null)
      toast.success('Post güncellendi')
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  // Image optimizasyonu için boyutları belirle
  const PROFILE_IMAGE_SIZE = 256 // Profil fotoğrafı için
  const POST_IMAGE_SIZE = 400 // Post fotoğrafları için

  return (
    <div className="min-h-[125vh] bg-gradient-to-b from-[#629584] to-[#243642] text-white px-2 sm:px-4 pb-8 transition-colors duration-300">
      {/* Profil İkonu */}
      {session?.user?.email && (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
          <Link href={`/${session.user.username}`}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 flex items-center justify-center cursor-pointer">
              {session.user.image ? (
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ''}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#ffb829] flex items-center justify-center text-base sm:text-lg font-semibold">
                  {(session.user.name || '').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
        </div>
      )}
      
      {/* Profile Section */}
      <div className="pt-8 sm:pt-12 flex flex-col items-center">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-[#ffb829] flex items-center justify-center">
          {editedUser.profileImage ? (
            <Image
              src={editedUser.profileImage}
              alt={editedUser.name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <span className="text-3xl sm:text-4xl font-bold text-white">
              {editedUser.name.charAt(0).toUpperCase()}
            </span>
          )}
          {isOwner && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-200"
              >
                <Upload className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {isOwner && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="text-xs sm:text-sm">
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Profili Düzenle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[80vh] overflow-y-auto mx-2">
                <DialogHeader>
                  <DialogTitle>Profili Düzenle</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">İsim</label>
                    <Input
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <div className="relative">
                      <Textarea
                        value={editedUser.bio}
                        onChange={(e) => {
                          const text = e.target.value
                          if (text.length <= 500) {
                            setEditedUser({ ...editedUser, bio: text })
                          }
                        }}
                        maxLength={500}
                        placeholder="Kendinizden bahsedin..."
                        className="min-h-[100px] resize-none"
                      />
                      <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {editedUser.bio?.length || 0}/500
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Konum</label>
                      <select
                        value={editedUser.location}
                        onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                        className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
                      >
                        <option value="">Seçiniz</option>
                        <option value="İstanbul">İstanbul</option>
                        <option value="Ankara">Ankara</option>
                        <option value="İzmir">İzmir</option>
                        <option value="Bursa">Bursa</option>
                        <option value="Antalya">Antalya</option>
                        <option value="Adana">Adana</option>
                        <option value="Konya">Konya</option>
                        <option value="Gaziantep">Gaziantep</option>
                        <option value="Mersin">Mersin</option>
                        <option value="Diyarbakır">Diyarbakır</option>
                        <option value="Eskişehir">Eskişehir</option>
                        <option value="Samsun">Samsun</option>
                        <option value="Denizli">Denizli</option>
                        <option value="Trabzon">Trabzon</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Website</label>
                      <Input
                        value={editedUser.website}
                        onChange={(e) => setEditedUser({ ...editedUser, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Profil Resmi URL</label>
                    <Input
                      value={editedUser.profileImage}
                      onChange={(e) => setEditedUser({ ...editedUser, profileImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sosyal Medya</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Facebook"
                        value={editedUser.socialLinks?.facebook}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, facebook: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Instagram"
                        value={editedUser.socialLinks?.instagram}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, instagram: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Twitter"
                        value={editedUser.socialLinks?.twitter}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, twitter: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="LinkedIn"
                        value={editedUser.socialLinks?.linkedin}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, linkedin: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="GitHub"
                        value={editedUser.socialLinks?.github}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, github: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="YouTube"
                        value={editedUser.socialLinks?.youtube}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, youtube: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Twitch"
                        value={editedUser.socialLinks?.twitch}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, twitch: e.target.value }
                        })}
                      />
                      <Input
                        placeholder="Discord"
                        value={editedUser.socialLinks?.discord}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          socialLinks: { ...editedUser.socialLinks, discord: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleUpdateProfile}>Kaydet</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddingPost} onOpenChange={setIsAddingPost}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="text-xs sm:text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Paylaşım Yap
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[80vh] overflow-y-auto mx-2">
                <DialogHeader>
                  <DialogTitle>Yeni Paylaşım</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Tür</label>
                    <select
                      className="w-full p-2 rounded-md bg-gray-800 text-white"
                      value={newPost.type}
                      onChange={(e) => setNewPost({ ...newPost, type: e.target.value as 'text' | 'music' })}
                    >
                      <option value="text">Metin</option>
                      <option value="music">Spotify Müzik</option>
                    </select>
                  </div>

                  {newPost.type === 'text' && (
                    <div>
                      <label className="text-sm font-medium">İçerik</label>
                      <Textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Ne düşünüyorsun?"
                      />
                    </div>
                  )}

                  {newPost.type === 'music' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Spotify'da Ara</label>
                      <div className="flex gap-2">
                        <Input
                          value={spotifySearchQuery}
                          onChange={(e) => setSpotifySearchQuery(e.target.value)}
                          placeholder="Şarkı adı veya sanatçı"
                          onKeyPress={(e) => e.key === 'Enter' && handleSpotifySearch()}
                        />
                        <Button onClick={handleSpotifySearch}>
                          Ara
                        </Button>
                      </div>
                      {spotifySearchResults.length > 0 && (
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {spotifySearchResults.map((track) => (
                            <div
                              key={track.id}
                              className="flex items-center gap-2 p-2 hover:bg-gray-700/50 rounded-md cursor-pointer"
                              onClick={() => handleTrackSelect(track)}
                            >
                              <img
                                src={track.album.images[2]?.url}
                                alt={track.name}
                                className="w-10 h-10 rounded"
                              />
                              <div>
                                <p className="font-medium">{track.name}</p>
                                <p className="text-sm text-gray-400">
                                  {track.artists.map(a => a.name).join(', ')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedTrack && (
                        <div className="p-2 bg-gray-800 rounded-md">
                          <div className="flex items-center gap-2">
                            <img
                              src={selectedTrack.album.images[2]?.url}
                              alt={selectedTrack.name}
                              className="w-10 h-10 rounded"
                            />
                            <div>
                              <p className="font-medium">{selectedTrack.name}</p>
                              <p className="text-sm text-gray-400">
                                {selectedTrack.artists.map(a => a.name).join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Açıklama</label>
                    <Textarea
                      value={newPost.caption}
                      onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                      placeholder="Paylaşımın hakkında bir şeyler yaz..."
                    />
                  </div>
                  <Button onClick={handleAddPost}>Paylaş</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="default" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Çıkış Yap
            </Button>
          </div>
        )}

        <h1 className="mt-4 text-xl sm:text-2xl font-bold text-center px-2">{editedUser.name}</h1>
        <p className="text-gray-400 text-sm sm:text-base">@{editedUser.username}</p>
        {editedUser.bio && <p className="mt-2 text-center whitespace-pre-wrap text-sm sm:text-base px-4">{editedUser.bio}</p>}
        {editedUser.location && <p className="text-gray-400 text-sm sm:text-base">{editedUser.location}</p>}
        {editedUser.website && (
          <a href={editedUser.website} target="_blank" rel="noopener noreferrer" className="text-[#629584] hover:underline text-sm sm:text-base break-all px-4 text-center">
            {editedUser.website}
          </a>
        )}

        {/* Social Links */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center max-w-[90vw] sm:max-w-[400px] mx-auto px-2 sm:px-4">
          {editedUser.socialLinks?.facebook && (
            <Link
              href={editedUser.socialLinks.facebook}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <Facebook className="w-6 h-6 text-[#1877f2]" />
            </Link>
          )}
          {editedUser.socialLinks?.instagram && (
            <Link
              href={editedUser.socialLinks.instagram}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <Instagram className="w-6 h-6 text-pink-500" />
            </Link>
          )}
          {editedUser.socialLinks?.twitter && (
            <Link
              href={editedUser.socialLinks.twitter}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <Twitter className="w-6 h-6 text-[#1DA1F2]" />
            </Link>
          )}
          {editedUser.socialLinks?.linkedin && (
            <Link
              href={editedUser.socialLinks.linkedin}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <Linkedin className="w-6 h-6 text-[#0A66C2]" />
            </Link>
          )}
          {editedUser.socialLinks?.github && (
            <Link
              href={editedUser.socialLinks.github}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <Github className="w-6 h-6 text-white" />
            </Link>
          )}
          {editedUser.socialLinks?.youtube && (
            <Link
              href={editedUser.socialLinks.youtube}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <Youtube className="w-6 h-6 text-[#FF0000]" />
            </Link>
          )}
          {editedUser.socialLinks?.twitch && (
            <Link
              href={editedUser.socialLinks.twitch}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <Twitch className="w-6 h-6 text-[#9146FF]" />
            </Link>
          )}
          {editedUser.socialLinks?.discord && (
            <Link
              href={editedUser.socialLinks.discord}
              target="_blank"
              className="p-2.5 bg-gray-800/50 rounded-xl w-14 h-14 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <MessageSquare className="w-6 h-6 text-[#5865F2]" />
            </Link>
          )}
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="feed" className="w-full max-w-[90vw] sm:max-w-md mt-6 sm:mt-8">
          <TabsList className="w-full bg-transparent border-b border-gray-800">
            <TabsTrigger
              value="feed"
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffb829] data-[state=active]:after:opacity-100 after:opacity-0 text-sm sm:text-base"
            >
              Akış
            </TabsTrigger>
            <TabsTrigger
              value="music"
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white text-sm sm:text-base"
            >
              Müzik
            </TabsTrigger>
          </TabsList>

          {/* Tab İçerikleri */}
          <TabsContent value="feed" className="mt-4 sm:mt-6">
            <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[90vw] sm:max-w-md">
              {editedUser.posts?.filter(post => post.type === 'text').map((post, index) => (
                <div key={index} className="rounded-2xl overflow-hidden bg-gray-800/50 p-4">
                  {isOwner && (
                    <div className="float-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditingPost({
                            id: post._id,
                            content: post.content,
                            caption: post.caption || ''
                          })}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post._id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  <p className="text-lg">{post.content}</p>
                  {post.caption && (
                    <p className="mt-2 text-gray-400 text-sm">{post.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="music" className="mt-4 sm:mt-6">
            <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[90vw] sm:max-w-md">
              {editedUser.posts?.filter(post => post.type === 'music').map((post, index) => (
                <div key={index} className="rounded-2xl overflow-hidden bg-gray-800/50 p-4">
                  {isOwner && (
                    <div className="float-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditingPost({
                            id: post._id,
                            caption: post.caption || ''
                          })}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post._id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  <iframe
                    src={`https://open.spotify.com/embed/track/${post.spotifyTrackId}`}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="encrypted-media"
                  />
                  {post.caption && (
                    <p className="mt-2 text-gray-400 text-sm">{post.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Post Düzenleme Dialog'u */}
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[80vh] overflow-y-auto mx-2">
            <DialogHeader>
              <DialogTitle>Paylaşımı Düzenle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingPost?.content !== undefined && (
                <div>
                  <label className="text-sm font-medium">İçerik</label>
                  <Textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost(prev => prev ? {
                      ...prev,
                      content: e.target.value
                    } : null)}
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Açıklama</label>
                <Textarea
                  value={editingPost?.caption}
                  onChange={(e) => setEditingPost(prev => prev ? {
                    ...prev,
                    caption: e.target.value
                  } : null)}
                />
              </div>
              <Button onClick={handleUpdatePost}>Kaydet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 