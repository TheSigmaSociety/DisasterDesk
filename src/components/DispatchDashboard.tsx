'use client'

import { useState, useEffect } from 'react'
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Users, 
  Activity,
  Filter,
  Plus,
  Zap,
  Shield,
  Radio,
  Target,
  Gauge,
  Signal,
  Eye,
  Command,
  Database,
  Wifi
} from 'lucide-react'

interface EmergencyCall {
  id: string
  createdAt: string
  callerName?: string
  location: string
  emergencyType: string
  severity: string
  description: string
  casualties: number
  status: string
  priority: string
  transcript?: string
  autoEscalated: boolean
  humanTakeover: boolean
}

interface Resource {
  id: string
  type: string
  identifier: string
  status: string
  location?: string
}

export default function DispatchDashboard() {
  const [calls, setCalls] = useState<EmergencyCall[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [filter, setFilter] = useState('ALL')
  const [selectedCall, setSelectedCall] = useState<EmergencyCall | null>(null)
  const [showResourceModal, setShowResourceModal] = useState(false)
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

  // Load data on component mount
  useEffect(() => {
    loadCalls()
    loadResources()
  }, [])

  const loadCalls = async () => {
    try {
      const response = await fetch('/api/emergency')
      if (response.ok) {
        const data = await response.json()
        setCalls(data)
      }
    } catch (error) {
      console.error('Error loading calls:', error)
      // Demo data for development
      setCalls([
        {
          id: '1',
          createdAt: new Date().toISOString(),
          callerName: 'John Doe',
          location: '123 Main St, Downtown',
          emergencyType: 'MEDICAL',
          severity: 'HIGH',
          description: 'Chest pain, difficulty breathing',
          casualties: 1,
          status: 'PENDING',
          priority: 'HIGH',
          autoEscalated: true,
          humanTakeover: false
        },
        {
          id: '2',
          createdAt: new Date(Date.now() - 600000).toISOString(),
          location: '456 Oak Ave, Suburbs',
          emergencyType: 'FIRE',
          severity: 'CRITICAL',
          description: 'House fire, multiple residents trapped',
          casualties: 3,
          status: 'DISPATCHED',
          priority: 'CRITICAL',
          autoEscalated: true,
          humanTakeover: true
        },
        {
          id: '3',
          createdAt: new Date(Date.now() - 1200000).toISOString(),
          location: '789 Pine Rd, Industrial District',
          emergencyType: 'POLICE',
          severity: 'MEDIUM',
          description: 'Break-in reported at warehouse facility',
          casualties: 0,
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          autoEscalated: false,
          humanTakeover: false
        }
      ])
    }
  }

  const loadResources = async () => {
    try {
      const response = await fetch('/api/resources')
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error('Error loading resources:', error)
      // Demo data for development
      setResources([
        { id: '1', type: 'AMBULANCE', identifier: 'AMB-101', status: 'AVAILABLE', location: 'Station 1' },
        { id: '2', type: 'FIRE_TRUCK', identifier: 'FIRE-205', status: 'DISPATCHED', location: '456 Oak Ave' },
        { id: '3', type: 'POLICE_CAR', identifier: 'UNIT-42', status: 'AVAILABLE', location: 'Patrol Area 3' },
        { id: '4', type: 'AMBULANCE', identifier: 'AMB-203', status: 'EN_ROUTE', location: 'Highway 101' },
        { id: '5', type: 'FIRE_TRUCK', identifier: 'FIRE-311', status: 'AVAILABLE', location: 'Station 2' },
        { id: '6', type: 'POLICE_CAR', identifier: 'UNIT-67', status: 'BUSY', location: '789 Pine Rd' },
      ])
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'status-critical'
      case 'HIGH': return 'status-high'
      case 'MEDIUM': return 'status-medium'
      case 'LOW': return 'status-low'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      case 'IN_PROGRESS': return 'text-blue-400 bg-blue-500/20 border-blue-500/50'
      case 'DISPATCHED': return 'text-purple-400 bg-purple-500/20 border-purple-500/50'
      case 'RESOLVED': return 'text-green-400 bg-green-500/20 border-green-500/50'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'AMBULANCE': return <Users className="h-5 w-5 text-blue-400" />
      case 'FIRE_TRUCK': return <Truck className="h-5 w-5 text-red-400" />
      case 'POLICE_CAR': return <Shield className="h-5 w-5 text-yellow-400" />
      default: return <Activity className="h-5 w-5 text-gray-400" />
    }
  }

  const getResourceStatus = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'text-green-400 bg-green-500/20 border-green-500/50'
      case 'DISPATCHED': return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'EN_ROUTE': return 'text-blue-400 bg-blue-500/20 border-blue-500/50'
      case 'BUSY': return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50'
    }
  }

  const filteredCalls = calls.filter(call => 
    filter === 'ALL' || call.priority === filter || call.status === filter
  )

  const assignResource = async (callId: string, resourceId: string) => {
    try {
      const response = await fetch('/api/assign-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, resourceId })
      })
      
      if (response.ok) {
        loadCalls()
        loadResources()
        setShowResourceModal(false)
      }
    } catch (error) {
      console.error('Error assigning resource:', error)
    }
  }

  // Statistics
  const totalCalls = calls.length
  const activeCalls = calls.filter(c => c.status !== 'RESOLVED').length
  const criticalCalls = calls.filter(c => c.priority === 'CRITICAL').length
  const availableResources = resources.filter(r => r.status === 'AVAILABLE').length

  return (
    <div className="min-h-screen p-6 relative">
      {/* Command Center Header */}
      <div className="glass-card p-6 rounded-2xl mb-6 neon-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Command className="h-8 w-8 text-cyan-400 mr-4" />
              <div>
                <h1 className="title-font text-3xl font-bold text-white">COMMAND CENTER</h1>
                <p className="text-gray-400 cyber-font">Emergency Response Coordination</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-right">
              <div className="cyber-font text-2xl text-cyan-400">{currentTime}</div>
              <div className="text-sm text-gray-400">SYSTEM TIME</div>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse mr-3"></div>
              <div className="text-right">
                <div className="cyber-font text-green-400 text-lg">OPERATIONAL</div>
                <div className="text-sm text-gray-400">ALL SYSTEMS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="glass-card p-6 rounded-xl hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <div className="cyber-font text-3xl font-bold text-cyan-400">{totalCalls}</div>
              <div className="text-sm text-gray-400">TOTAL CALLS</div>
            </div>
            <Database className="h-8 w-8 text-cyan-400 opacity-60" />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <div className="cyber-font text-3xl font-bold text-yellow-400">{activeCalls}</div>
              <div className="text-sm text-gray-400">ACTIVE</div>
            </div>
            <Activity className="h-8 w-8 text-yellow-400 opacity-60" />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <div className="cyber-font text-3xl font-bold text-red-400">{criticalCalls}</div>
              <div className="text-sm text-gray-400">CRITICAL</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400 opacity-60" />
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-xl hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <div className="cyber-font text-3xl font-bold text-green-400">{availableResources}</div>
              <div className="text-sm text-gray-400">AVAILABLE</div>
            </div>
            <Shield className="h-8 w-8 text-green-400 opacity-60" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Emergency Calls Panel */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Radio className="h-6 w-6 text-red-400 mr-3" />
                  <h2 className="cyber-font text-xl font-bold text-white">EMERGENCY CALLS</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="glass border border-gray-600 rounded-lg px-3 py-2 text-white cyber-font text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="ALL">ALL CALLS</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH PRIORITY</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {filteredCalls.map((call) => (
                <div 
                  key={call.id}
                  className={`p-6 border-b border-gray-800 hover:bg-gray-800/30 cursor-pointer transition-all ${
                    selectedCall?.id === call.id ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400' : ''
                  }`}
                  onClick={() => setSelectedCall(call)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold cyber-font ${getPriorityColor(call.priority)} text-white`}>
                          {call.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs border cyber-font ${getStatusColor(call.status)}`}>
                          {call.status}
                        </span>
                        {call.autoEscalated && (
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs border border-orange-500/50 cyber-font">
                            AUTO-ESCALATED
                          </span>
                        )}
                        {call.humanTakeover && (
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/50 cyber-font">
                            HUMAN TAKEOVER
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <div className="cyber-font text-white text-lg mb-1">{call.emergencyType}</div>
                        <div className="text-gray-400 text-sm">
                          {call.casualties > 0 ? `${call.casualties} casualties reported` : 'No casualties reported'}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-green-400" />
                        {call.location}
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed">{call.description}</p>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(call.createdAt).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {call.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Resources Panel */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="h-6 w-6 text-blue-400 mr-3" />
                  <h3 className="cyber-font text-lg font-bold text-white">RESOURCES</h3>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getResourceIcon(resource.type)}
                      <div className="ml-3">
                        <div className="cyber-font text-white text-sm">{resource.identifier}</div>
                        <div className="text-xs text-gray-400">{resource.location}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs border cyber-font ${getResourceStatus(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call Details Panel */}
          {selectedCall && (
            <div className="glass-card rounded-2xl">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center">
                  <Eye className="h-6 w-6 text-purple-400 mr-3" />
                  <h3 className="cyber-font text-lg font-bold text-white">CALL DETAILS</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">TYPE</div>
                    <div className="cyber-font text-white">{selectedCall.emergencyType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">SEVERITY</div>
                    <div className={`cyber-font font-bold ${
                      selectedCall.severity === 'CRITICAL' ? 'text-red-400' :
                      selectedCall.severity === 'HIGH' ? 'text-orange-400' :
                      selectedCall.severity === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {selectedCall.severity}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">LOCATION</div>
                  <div className="text-white text-sm">{selectedCall.location}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">DESCRIPTION</div>
                  <div className="text-white text-sm leading-relaxed">{selectedCall.description}</div>
                </div>
                
                {selectedCall.transcript && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">TRANSCRIPT</div>
                    <div className="glass p-3 rounded-lg text-sm text-gray-300">
                      "{selectedCall.transcript}"
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    onClick={() => setShowResourceModal(true)}
                    className="w-full cyber-button py-3 px-4 rounded-xl hover-lift"
                  >
                    <Target className="h-5 w-5 mr-2 inline" />
                    ASSIGN RESOURCES
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resource Assignment Modal */}
      {showResourceModal && selectedCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-2xl max-w-md w-full neon-border">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-cyan-400 mr-3" />
                <h3 className="cyber-font text-xl font-bold text-white">ASSIGN RESOURCES</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                {resources.filter(r => r.status === 'AVAILABLE').map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => assignResource(selectedCall.id, resource.id)}
                    className="w-full text-left p-4 glass rounded-xl hover:bg-gray-700/50 transition-all border border-gray-600 hover:border-cyan-400"
                  >
                    <div className="flex items-center">
                      {getResourceIcon(resource.type)}
                      <div className="ml-3 flex-1">
                        <div className="cyber-font text-white">{resource.identifier}</div>
                        <div className="text-sm text-gray-400">{resource.location}</div>
                      </div>
                      <div className="text-green-400 text-sm cyber-font">AVAILABLE</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="px-6 py-2 glass rounded-lg text-gray-300 hover:text-white transition-colors cyber-font"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}