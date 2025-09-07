import { X, Shield, Zap, Brain, Globe, Users, Activity, Cpu, Lock } from 'lucide-react'

interface AboutProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="relative glass-card p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl neon-border">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cyber-button p-2 rounded-lg"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="title-font text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            DISASTERDESK
          </h1>
          <p className="text-xl text-gray-300 cyber-font">
            NEXT-GENERATION EMERGENCY RESPONSE SYSTEM
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Mission */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-cyan-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">MISSION</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                DisasterDesk revolutionizes emergency response through advanced AI technology, 
                ensuring rapid, accurate, and efficient handling of critical situations. Our 
                mission is to save lives by reducing response times and optimizing resource allocation.
              </p>
            </div>

            {/* Key Features */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-purple-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">AI CAPABILITIES</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                  Real-time voice recognition and natural language processing
                </div>
                <div className="flex items-center text-gray-300">
                  <Activity className="h-4 w-4 text-green-400 mr-2" />
                  Automatic emergency classification and severity assessment
                </div>
                <div className="flex items-center text-gray-300">
                  <Globe className="h-4 w-4 text-blue-400 mr-2" />
                  Intelligent location detection and mapping
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="h-4 w-4 text-pink-400 mr-2" />
                  Smart resource allocation and dispatch optimization
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Cpu className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">TECHNOLOGY</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-cyan-400 font-semibold">Frontend</div>
                  <div className="text-gray-400">Next.js 14</div>
                  <div className="text-gray-400">React 18</div>
                  <div className="text-gray-400">TypeScript</div>
                  <div className="text-gray-400">Tailwind CSS</div>
                </div>
                <div className="space-y-2">
                  <div className="text-purple-400 font-semibold">AI & Backend</div>
                  <div className="text-gray-400">OpenAI GPT-4</div>
                  <div className="text-gray-400">Web Speech API</div>
                  <div className="text-gray-400">Prisma ORM</div>
                  <div className="text-gray-400">Real-time WebSocket</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* System Status */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Activity className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">SYSTEM STATUS</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">AI Response Engine</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 text-sm cyber-font">ONLINE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Voice Recognition</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 text-sm cyber-font">ACTIVE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Dispatch Network</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 text-sm cyber-font">CONNECTED</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Location Services</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 text-sm cyber-font">OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-yellow-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">PERFORMANCE</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 cyber-font">2.3s</div>
                  <div className="text-sm text-gray-400">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 cyber-font">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 cyber-font">96%</div>
                  <div className="text-sm text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 cyber-font">24/7</div>
                  <div className="text-sm text-gray-400">Availability</div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-red-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">SECURITY</h3>
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  End-to-end encryption for all communications
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  HIPAA compliant data handling
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Multi-factor authentication
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Regular security audits and updates
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              DisasterDesk © 2024 | Advanced Emergency Response Technology
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Built with cutting-edge AI to protect and serve communities worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}