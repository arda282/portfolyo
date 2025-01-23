"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Github, Instagram } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#629584] to-[#243642] text-white px-4 pb-8 transition-colors duration-300">
      {/* Profile Section */}
      <div className="pt-12 flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-[#ffb829]"></div>

        <h1 className="mt-4 text-2xl font-bold">Arda ŞENGÜR</h1>
        <p className="text-gray-400">@ardasengur</p>

        {/* Social Links */}
        <div className="flex gap-6 mt-6">
          <Link
            href="#"
            className="p-2.5 bg-gray-800/50 rounded-xl w-16 h-16 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
          >
            <Facebook className="w-6 h-6 text-[#1877f2]" />
            <span className="block text-[11px] mt-0.5 text-center">3.5k</span>
          </Link>
          <Link
            href="#"
            className="p-2.5 bg-gray-800/50 rounded-xl w-16 h-16 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
          >
            <Github className="w-6 h-6" />
            <span className="block text-[11px] mt-0.5 text-center">359</span>
          </Link>
          <Link
            href="#"
            className="p-2.5 bg-gray-800/50 rounded-xl w-16 h-16 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#0ACF83"
              />
              <path
                d="M8 12C8 10.8954 8.89543 10 10 10H14C15.1046 10 16 10.8954 16 12V16C16 17.1046 15.1046 18 14 18H10C8.89543 18 8 17.1046 8 16V12Z"
                fill="white"
              />
              <path
                d="M8 6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V10H10C8.89543 10 8 9.10457 8 8V6Z"
                fill="white"
              />
            </svg>
            <span className="block text-[11px] mt-0.5 text-center">620</span>
          </Link>
          <Link
            href="#"
            className="p-2.5 bg-gray-800/50 rounded-xl w-16 h-16 flex flex-col items-center justify-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
          >
            <Instagram className="w-6 h-6 text-pink-500" />
            <span className="block text-[11px] mt-0.5 text-center">1.6k</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="photos" className="w-full max-w-md mt-8">
          <TabsList className="w-full bg-transparent border-b border-gray-800">
            <TabsTrigger
              value="all"
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffb829] data-[state=active]:after:opacity-100 after:opacity-0"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger
              value="music"
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Music
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white"
            >
              Videos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Photo 1"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Photo 2"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Photo 3"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Photo 4"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Photo 5"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Photo 6"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

