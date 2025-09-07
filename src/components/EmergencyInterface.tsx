'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MapPin, 
  AlertTriangle, 
  Activity,
  Zap,
  Radio,
  Signal,
  Clock,
  User,
  Send,
  Eye,
  Shield
} from 'lucide-react'
import { useEmergencyCall } from '@/hooks/useEmergencyCall'

interface LocationData {
  latitude: number
  longitude: number
  address?: string
}

export default function EmergencyInterface() {
  const {
    isConnected,
    isRecording,
    transcript,
    emergencyData,
    error,
    speechError,
    isAIResponding,
    startEmergencyCall,
    sendTextMessage,
    interrupt,
    endCall
  } = useEmergencyCall()

  const [testMessage, setTestMessage] = useState('')
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

  const handleSendTestMessage = () => {
    if (testMessage.trim()) {
      sendTextMessage(testMessage)
      setTestMessage('')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 border-red-500/50 bg-red-500/10'
      case 'HIGH': return 'text-orange-400 border-orange-500/50 bg-orange-500/10'
      case 'MEDIUM': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10'
      case 'LOW': return 'text-green-400 border-green-500/50 bg-green-500/10'
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen p-6 relative">
      {/* HUD Header */}
      <div className="glass-card p-4 rounded-2xl mb-6 neon-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-cyan-400 mr-3" />
              <div>
                <h1 className="cyber-font text-2xl font-bold text-white">EMERGENCY INTERFACE</h1>
                <p className="text-sm text-gray-400">AI-Powered Response System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="cyber-font text-lg text-cyan-400">{currentTime}</div>
              <div className="text-xs text-gray-400">SYSTEM TIME</div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <div className="text-right">
                <div className={`cyber-font text-sm ${
                  isConnected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isConnected ? 'CONNECTED' : 'OFFLINE'}
                </div>
                <div className="text-xs text-gray-400">STATUS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connection Status & Controls */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-center mb-6">
              <Radio className="h-6 w-6 text-purple-400 mr-3" />
              <h2 className="cyber-font text-xl font-bold text-white">CONNECTION STATUS</h2>
            </div>

            {/* Status Display */}
            <div className="mb-6 p-4 glass rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Signal className="h-5 w-5 text-cyan-400 mr-2" />
                  <span className="cyber-font text-white">SIGNAL STRENGTH</span>
                </div>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-2 h-4 ${
                      i <= (isConnected ? 5 : 0) ? 'bg-green-400' : 'bg-gray-600'
                    }`}></div>
                  ))}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 ${
                isConnected 
                  ? isAIResponding
                    ? 'border-blue-400 bg-blue-500/10'
                    : isRecording 
                      ? 'border-red-400 bg-red-500/10'
                      : 'border-green-400 bg-green-500/10'
                  : 'border-gray-400 bg-gray-500/10'
              }`}>
                <div className="flex items-center mb-2">
                  {isConnected ? (
                    isAIResponding ? (
                      <>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mr-3"></div>
                        <span className="cyber-font text-blue-400">AI DISPATCHER RESPONDING</span>
                      </>
                    ) : isRecording ? (
                      <>
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse mr-3"></div>
                        <span className="cyber-font text-red-400">RECORDING ACTIVE</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                        <span className="cyber-font text-green-400">READY TO RECEIVE</span>
                      </>
                    )
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                      <span className="cyber-font text-gray-400">DISCONNECTED</span>
                    </>
                  )}
                </div>
                <p className="text-gray-300 text-sm">
                  {isConnected 
                    ? isAIResponding
                      ? "AI dispatcher is processing your emergency. Please listen carefully to the instructions."
                      : isRecording 
                        ? "Voice recognition active. Speak clearly to report your emergency."
                        : "Emergency line is open. Begin speaking to report your situation."
                    : "Click 'INITIATE EMERGENCY CALL' to connect to emergency services."
                  }
                </p>
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex flex-col items-center space-y-4">
              {!isConnected ? (
                <button
                  onClick={startEmergencyCall}
                  className="cyber-button px-8 py-4 rounded-xl text-lg flex items-center"
                >
                  <Phone className="h-6 w-6 mr-3" />
                  INITIATE EMERGENCY CALL
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button
                    onClick={interrupt}
                    className="flex-1 px-6 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 transition-all cyber-font flex items-center justify-center"
                  >
                    <MicOff className="h-5 w-5 mr-2" />
                    INTERRUPT AI
                  </button>
                  
                  <button
                    onClick={endCall}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all cyber-font flex items-center justify-center"
                  >
                    <PhoneOff className="h-5 w-5 mr-2" />
                    END CALL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          {isConnected && (
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <Activity className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">LIVE TRANSCRIPT</h3>
                {isRecording && (
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                    <span className="cyber-font text-red-400 text-sm">RECORDING</span>
                  </div>
                )}
              </div>
              
              <div className="glass p-6 rounded-xl min-h-[200px] border border-cyan-500/30">
                {transcript ? (
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <User className="h-4 w-4 text-cyan-400 mr-2 mt-1" />
                      <div>
                        <span className="text-cyan-400 text-sm cyber-font">CALLER:</span>
                        <p className="text-white mt-1">"{transcript}"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="cyber-font">
                        {isRecording 
                          ? "LISTENING... SPEAK NOW"
                          : "TRANSCRIPT WILL APPEAR HERE"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Text Input Alternative */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="cyber-font text-xl font-bold text-white">
                {speechError ? 'TEXT INPUT (SPEECH UNAVAILABLE)' : 'ALTERNATIVE TEXT INPUT'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder={speechError ? "Describe your emergency here..." : "Type emergency details..."}
                  className="flex-1 px-4 py-3 glass rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none cyber-font"
                  disabled={!isConnected}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
                />
                <button
                  onClick={handleSendTestMessage}
                  disabled={!isConnected || !testMessage.trim()}
                  className="cyber-button px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  SEND
                </button>
              </div>
              
              {speechError && (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-center text-yellow-400 mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="cyber-font font-semibold">SPEECH RECOGNITION ERROR</span>
                  </div>
                  <p className="text-yellow-300 text-sm">{speechError}</p>
                  <p className="text-gray-300 text-sm mt-2">
                    Please use the text input above to describe your emergency.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Location Display */}
          {emergencyData?.location && (
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="cyber-font text-lg font-bold text-white">LOCATION</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 glass rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">COORDINATES</div>
                  <div className="cyber-font text-green-400">
                    {emergencyData?.latitude?.toFixed(6)}, {emergencyData?.longitude?.toFixed(6)}
                  </div>
                </div>
                <div className="p-3 glass rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">ADDRESS</div>
                  <div className="text-white text-sm">{emergencyData?.location}</div>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Data */}
          {emergencyData?.type && (
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
                <h3 className="cyber-font text-lg font-bold text-white">EMERGENCY DATA</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 glass rounded-xl">
                  <div className="text-sm text-gray-400 mb-2">TYPE</div>
                  <div className="cyber-font text-white text-lg">{emergencyData?.type}</div>
                </div>
                
                <div className={`p-4 rounded-xl border-2 ${getSeverityColor(emergencyData?.severity || '')}`}>
                  <div className="text-sm text-gray-400 mb-2">SEVERITY</div>
                  <div className="cyber-font text-lg font-bold">{emergencyData?.severity}</div>
                </div>
                
                <div className="p-4 glass rounded-xl">
                  <div className="text-sm text-gray-400 mb-2">DESCRIPTION</div>
                  <div className="text-white text-sm leading-relaxed">{emergencyData?.description}</div>
                </div>
                
                {(emergencyData?.casualties ?? 0) > 0 && (
                  <div className="p-4 glass rounded-xl border border-red-500/50">
                    <div className="text-sm text-gray-400 mb-2">CASUALTIES</div>
                    <div className="cyber-font text-red-400 text-2xl font-bold">{emergencyData?.casualties}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Human Takeover Alert */}
          {emergencyData?.humanTakeover && (
            <div className="glass-card p-6 rounded-2xl border-2 border-red-500/50 bg-red-500/10">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-red-400 mr-3 animate-pulse" />
                <h3 className="cyber-font text-lg font-bold text-red-400">HUMAN DISPATCHER</h3>
              </div>
              <p className="text-red-300 text-sm leading-relaxed">
                Critical situation detected. You are being connected to a human dispatcher immediately.
                Please remain on the line.
              </p>
            </div>
          )}

          {/* System Errors */}
          {(error || speechError) && (
            <div className="glass-card p-6 rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/10">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
                <h3 className="cyber-font text-lg font-bold text-yellow-400">SYSTEM ALERT</h3>
              </div>
              {error && (
                <div className="mb-3">
                  <div className="text-sm text-gray-400 mb-1">CONNECTION ERROR</div>
                  <p className="text-yellow-300 text-sm">{error}</p>
                </div>
              )}
              {speechError && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">SPEECH RECOGNITION</div>
                  <p className="text-yellow-300 text-sm">{speechError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}