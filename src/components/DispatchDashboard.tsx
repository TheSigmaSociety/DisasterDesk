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
  Plus
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
        { id: '1', type: 'AMBULANCE', identifier: 'Ambulance 101', status: 'AVAILABLE', location: 'Station 1' },
        { id: '2', type: 'FIRE_TRUCK', identifier: 'Fire Truck 205', status: 'DISPATCHED', location: '456 Oak Ave' },
        { id: '3', type: 'POLICE_CAR', identifier: 'Police Unit 42', status: 'AVAILABLE', location: 'Patrol Area 3' },
      ])
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500 text-white'
      case 'HIGH': return 'bg-orange-500 text-white'
      case 'MEDIUM': return 'bg-yellow-500 text-white'
      case 'LOW': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'DISPATCHED': return 'bg-purple-100 text-purple-800'
      case 'RESOLVED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dispatch Center</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            <Activity className="h-4 w-4 mr-1" />
            System Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Calls List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Emergency Calls</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="ALL">All Calls</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High Priority</option>
                    <option value="PENDING">Pending</option>
                    <option value="DISPATCHED">Dispatched</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredCalls.map((call) => (
                <div 
                  key={call.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedCall?.id === call.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCall(call)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(call.priority)}`}>
                          {call.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(call.status)}`}>
                          {call.status}
                        </span>
                        {call.autoEscalated && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                            AUTO-ESCALATED
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {call.emergencyType} • {call.casualties > 0 ? `${call.casualties} casualties` : 'No casualties'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {call.location}
                      </div>
                      <p className="text-sm text-gray-700">{call.description}</p>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(call.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resources Panel */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Resources</h3>
                <button className="text-blue-600 hover:text-blue-800">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="flex items-center">
                      {resource.type === 'AMBULANCE' && <Users className="h-4 w-4 mr-2 text-blue-500" />}
                      {resource.type === 'FIRE_TRUCK' && <Truck className="h-4 w-4 mr-2 text-red-500" />}
                      {resource.type === 'POLICE_CAR' && <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />}
                      <span className="text-sm font-medium">{resource.identifier}</span>
                    </div>
                    <div className="text-xs text-gray-500">{resource.location}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    resource.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                    resource.status === 'DISPATCHED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {resource.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Call Details Panel */}
          {selectedCall && (
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Call Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Emergency Type</label>
                  <p className="text-gray-900">{selectedCall.emergencyType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Severity</label>
                  <p className={`font-semibold ${
                    selectedCall.severity === 'CRITICAL' ? 'text-red-600' :
                    selectedCall.severity === 'HIGH' ? 'text-orange-600' :
                    selectedCall.severity === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedCall.severity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-gray-900">{selectedCall.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900">{selectedCall.description}</p>
                </div>
                {selectedCall.transcript && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transcript</label>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                      "{selectedCall.transcript}"
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <button
                    onClick={() => setShowResourceModal(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-medium"
                  >
                    Assign Resources
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resource Assignment Modal */}
      {showResourceModal && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Assign Resources</h3>
              <div className="space-y-3">
                {resources.filter(r => r.status === 'AVAILABLE').map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => assignResource(selectedCall.id, resource.id)}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {resource.type === 'AMBULANCE' && <Users className="h-4 w-4 mr-2 text-blue-500" />}
                      {resource.type === 'FIRE_TRUCK' && <Truck className="h-4 w-4 mr-2 text-red-500" />}
                      {resource.type === 'POLICE_CAR' && <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />}
                      <div>
                        <div className="font-medium">{resource.identifier}</div>
                        <div className="text-sm text-gray-500">{resource.location}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
