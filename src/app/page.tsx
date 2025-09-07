'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Users, Shield, Info, Activity, Zap, Cpu, Globe, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import About from '../components/about'

export default function HomePage() {
  const [showAbout, setShowAbout] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Image 
          src="/home1.jpg" 
          alt="Emergency Background" 
          fill 
          priority 
          className="object-cover opacity-20 z-0" 
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-900/30 to-purple-900/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
      </div>

      {/* Header Bar */}
      <div className="relative z-30 flex justify-between items-center p-6 glass-card">
        <div className="flex items-center space-x-6">
          <div className="cyber-font text-lg text-cyan-400">
            DISASTER<span className="text-purple-400">DESK</span>
          </div>
          <div className="text-sm text-gray-400 cyber-font">
            {currentTime}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-1 glass rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-400 cyber-font">SYSTEM ACTIVE</span>
          </div>
          <button 
            onClick={() => setShowAbout(true)} 
            className="cyber-button px-4 py-2 rounded-lg text-sm hover-lift"
          >
            <Info className="h-4 w-4 mr-2 inline" />
            ABOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 w-full max-w-6xl mx-auto">
          <h1 className="title-font text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-glow mx-auto">
            DISASTER<span className="text-white">DESK</span>
          </h1>
          <div className="relative">
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Advanced AI-powered emergency response system
            </p>
            <p className="text-lg text-cyan-400 cyber-font tracking-wide">
              Because every second counts when lives are at stake
            </p>
          </div>

          {/* Stats Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 mb-16">
            <div className="glass-card p-4 rounded-lg hover-lift">
              <div className="text-2xl font-bold text-cyan-400 cyber-font">24/7</div>
              <div className="text-sm text-gray-400">AVAILABILITY</div>
            </div>
            <div className="glass-card p-4 rounded-lg hover-lift">
              <div className="text-2xl font-bold text-purple-400 cyber-font">AI</div>
              <div className="text-sm text-gray-400">POWERED</div>
            </div>
            <div className="glass-card p-4 rounded-lg hover-lift">
              <div className="text-2xl font-bold text-green-400 cyber-font">&lt;5S</div>
              <div className="text-sm text-gray-400">RESPONSE</div>
            </div>
            <div className="glass-card p-4 rounded-lg hover-lift">
              <div className="text-2xl font-bold text-pink-400 cyber-font">100%</div>
              <div className="text-sm text-gray-400">RELIABLE</div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Emergency Caller Card */}
          <Link href="/emergency" className="group">
            <div className="glass-card p-8 rounded-2xl hover-lift transition-all duration-500 border-2 border-red-500/20 hover:border-red-400/50 bg-gradient-to-br from-red-500/5 to-orange-500/5">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Phone className="relative h-24 w-24 text-red-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <div>
                  <h2 className="cyber-font text-3xl font-bold text-white mb-3">
                    EMERGENCY CALLER
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
                    Report emergencies through advanced AI voice recognition and natural language processing
                  </p>
                </div>

                <div className="flex items-center justify-center w-full">
                  <div className="cyber-button px-8 py-4 rounded-xl text-lg group-hover:scale-105 transition-transform">
                    <Activity className="h-5 w-5 mr-3 inline" />
                    REPORT EMERGENCY
                    <ArrowRight className="h-5 w-5 ml-3 inline group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Feature indicators */}
                <div className="flex justify-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                    INSTANT
                  </div>
                  <div className="flex items-center">
                    <Cpu className="h-3 w-3 mr-1 text-blue-400" />
                    AI-POWERED
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-3 w-3 mr-1 text-green-400" />
                    LOCATION-AWARE
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Dispatch Center Card */}
          <Link href="/dispatch" className="group">
            <div className="glass-card p-8 rounded-2xl hover-lift transition-all duration-500 border-2 border-blue-500/20 hover:border-blue-400/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Users className="relative h-24 w-24 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <div>
                  <h2 className="cyber-font text-3xl font-bold text-white mb-3">
                    DISPATCH CENTER
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
                    Command center for emergency response coordination and resource management
                  </p>
                </div>

                <div className="flex items-center justify-center w-full">
                  <div className="cyber-button px-8 py-4 rounded-xl text-lg group-hover:scale-105 transition-transform">
                    <Shield className="h-5 w-5 mr-3 inline" />
                    ACCESS COMMAND
                    <ArrowRight className="h-5 w-5 ml-3 inline group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Feature indicators */}
                <div className="flex justify-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center">
                    <Activity className="h-3 w-3 mr-1 text-cyan-400" />
                    REAL-TIME
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-purple-400" />
                    MULTI-RESOURCE
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 mr-1 text-green-400" />
                    SECURE
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-16 glass-card px-6 py-3 rounded-full">
          <div className="flex items-center space-x-6 text-sm cyber-font">
            <div className="flex items-center text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              ALL SYSTEMS OPERATIONAL
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-gray-400">
              LAST UPDATE: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  )
}

