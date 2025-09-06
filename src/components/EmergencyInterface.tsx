'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Phone, PhoneOff, MapPin, AlertTriangle } from 'lucide-react'

interface LocationData {
  latitude: number
  longitude: number
  address?: string
}

interface EmergencyData {
  type: string
  severity: string
  description: string
  casualties: number
  location: LocationData | null
}

export default function EmergencyInterface() {
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [emergencyData, setEmergencyData] = useState<EmergencyData>({
    type: '',
    severity: '',
    description: '',
    casualties: 0,
    location: null
  })
  const [status, setStatus] = useState('Click to start emergency report')
  const [humanTakeover, setHumanTakeover] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEmergencyData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const startEmergencyCall = async () => {
    setIsConnected(true)
    setStatus('Connecting to AI Emergency Agent...')
    
    // Simulate connection delay
    setTimeout(() => {
      setStatus('Connected - Please describe your emergency')
      setIsRecording(true)
    }, 2000)
  }

  const endCall = () => {
    setIsConnected(false)
    setIsRecording(false)
    setStatus('Call ended')
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  // Simulate AI processing and data extraction
  const simulateAIProcessing = () => {
    const sampleData = {
      type: 'MEDICAL',
      severity: 'HIGH',
      description: 'Chest pain, difficulty breathing',
      casualties: 1,
      location: emergencyData.location
    }
    setEmergencyData(sampleData)
    setTranscript('I need help, I\'m having chest pain and trouble breathing...')
    
    // Simulate auto-escalation for critical situations
    if (sampleData.severity === 'HIGH' || sampleData.severity === 'CRITICAL') {
      setTimeout(() => {
        setHumanTakeover(true)
        setStatus('Critical situation detected - Connecting to human dispatcher...')
      }, 5000)
    }
  }

  const submitEmergencyReport = async () => {
    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emergencyData,
          transcript,
          autoEscalated: humanTakeover
        })
      })
      
      if (response.ok) {
        setStatus('Emergency report submitted successfully')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      setStatus('Error submitting report')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Emergency Report</h1>
          </div>
          <p className="text-gray-600">
            Speak clearly to our AI agent who will gather your emergency details
          </p>
        </div>

        {/* Status Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Status</span>
            <div className={`px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          <p className="text-gray-700">{status}</p>
        </div>

        {/* Location Display */}
        {emergencyData.location && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold">Location Detected</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Lat: {emergencyData.location.latitude.toFixed(6)}, 
              Lng: {emergencyData.location.longitude.toFixed(6)}
            </p>
          </div>
        )}

        {/* Call Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            {!isConnected ? (
              <button
                onClick={startEmergencyCall}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center mx-auto"
              >
                <Phone className="h-6 w-6 mr-2" />
                Start Emergency Call
              </button>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={toggleRecording}
                  className={`${
                    isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
                  } text-white font-bold py-3 px-6 rounded-full flex items-center mx-auto`}
                >
                  {isRecording ? (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <MicOff className="h-5 w-5 mr-2" />
                      Tap to Speak
                    </>
                  )}
                </button>
                
                <button
                  onClick={endCall}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full flex items-center mx-auto"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Data Display */}
        {emergencyData.type && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Emergency Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-900">{emergencyData.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Severity</label>
                <p className={`font-semibold ${
                  emergencyData.severity === 'CRITICAL' ? 'text-red-600' :
                  emergencyData.severity === 'HIGH' ? 'text-orange-600' :
                  emergencyData.severity === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {emergencyData.severity}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{emergencyData.description}</p>
              </div>
              {emergencyData.casualties > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Casualties</label>
                  <p className="text-gray-900">{emergencyData.casualties}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Call Transcript</h3>
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
              <p className="text-gray-700 italic">"{transcript}"</p>
            </div>
          </div>
        )}

        {/* Human Takeover Alert */}
        {humanTakeover && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-semibold text-red-800">Critical Situation Detected</span>
            </div>
            <p className="text-red-700 mt-1">
              You are being connected to a human dispatcher immediately.
            </p>
          </div>
        )}

        {/* Demo Controls */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">Demo Controls</h4>
          <div className="space-x-2">
            <button
              onClick={simulateAIProcessing}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            >
              Simulate AI Processing
            </button>
            <button
              onClick={submitEmergencyReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
