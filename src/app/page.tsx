'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Users, Shield, Info } from 'lucide-react'
import { useState } from 'react'
import About from '../components/about'

export default function HomePage() {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden z-10">
        <Image src="/home1.jpg" alt="test" fill priority className="object-cover object-center z-0" sizes="100vw"/>
        <div className="absolute inset-0 bg-white/1 backdrop-blur-xl z-10 shadow-xl"/>
        <div className="relative z-20 p-8 max-w-3xl w-full text-center">
          <h1 className="title-font text-7xl md:text-8xl font-bold text-white mb-4 drop-shadow-md tracking-wider">DisasterDesk</h1>
          <p className="text-xl text-white mb-6 max-w-2xl mx-auto drop-shadow-sm"> Because a call for your life shouldn't be put on hold.</p>

          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-500 text-white border border-green-400/40 shadow-md">
              <Shield className="h-5 w-5 mr-2 text-green-300" />
              System Status: Operational
            </div>

            <button onClick={() => setShowAbout(true)} className="inline-flex items-center px-4 py-2 bg-blue-500  text-white border border-blue-400/40 shadow-md hover:bg-blue-500/40 transition-colors">
              <Info className="h-5 w-5 mr-2 text-blue-300" />
              About Us
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-1/2">
        <Link href="/emergency" className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-hidden backdrop-blur-md shadow-lg transition-all group bg-emergency">
          <div className="flex flex-col items-center text-center">
            <Phone className="h-36 w-36 text-white mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm mb-3">Emergency Caller</h2>
            <p className="text-white/90 text-lg max-w-xs"> Report an emergency through AI-powered voice assistance.</p>
            <div className="text-white font-semibold mt-6 flex items-center text-2xl">
              <span className="group-hover:translate-x-1 transition-transform">Get Help →</span>
            </div>
          </div>
        </Link>
        <Link href="/dispatch" className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-hidden backdrop-blur-md shadow-lg transition-all group bg-dispatch">
          <div className="flex flex-col items-center text-center">
            <Users className="h-36 w-36 text-white mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm mb-3">Dispatch Center</h2>
            <p className="text-white/90 text-lg max-w-xs"> Monitor and manage emergency response teams and resources.</p>
            <div className="text-white font-semibold mt-6 flex items-center text-2xl">
              <span className="group-hover:translate-x-1 transition-transform">Command Center →</span>
            </div>
          </div>
        </Link>
      </div>

      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  )
}

