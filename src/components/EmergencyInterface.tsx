'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Phone, PhoneOff, MapPin, AlertTriangle } from 'lucide-react'
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

  // For demo: send a test message
  const handleSendTestMessage = () => {
    if (testMessage.trim()) {
      sendTextMessage(testMessage)
      setTestMessage('')
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

        {/* Speech Recognition Error Alert */}
        {speechError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-semibold text-yellow-800">Speech Recognition Issue</span>
            </div>
            <p className="text-yellow-700 mt-1">
              {speechError}
            </p>
          </div>
        )}

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
          <p className="text-gray-700">
            {isConnected 
              ? isAIResponding
                ? "🤖 AI dispatcher is responding... Please listen."
                : isRecording 
                  ? "🎤 Listening for your emergency report. Please speak clearly."
                  : "Connected to emergency services. You can speak now."
              : "Click 'Start Emergency Call' to begin reporting your emergency."
            }
          </p>
        </div>

        {/* Location Display */}
        {emergencyData?.location && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold">Location Detected</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Lat: {emergencyData?.latitude?.toFixed(6)},
              Lng: {emergencyData?.longitude?.toFixed(6)}
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
                <div className="text-green-600 font-semibold flex items-center justify-center">
                  {isAIResponding ? (
                    <>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                      <span className="h-5 w-5 mr-2">🤖</span>
                      AI responding - Please listen
                    </>
                  ) : isRecording ? (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      <Mic className="h-5 w-5 mr-2" />
                      Recording - Speak now
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Connected - Ready to listen
                    </>
                  )}
                </div>
                
                <button
                  onClick={interrupt}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full flex items-center mx-auto mr-2"
                >
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop AI Response
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
        {emergencyData?.type && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Emergency Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-900">{emergencyData?.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Severity</label>
                <p className={`font-semibold ${
                  emergencyData?.severity === 'CRITICAL' ? 'text-red-600' :
                  emergencyData?.severity === 'HIGH' ? 'text-orange-600' :
                  emergencyData?.severity === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {emergencyData?.severity}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{emergencyData?.description}</p>
              </div>
              {(emergencyData?.casualties ?? 0) > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Casualties</label>
                  <p className="text-gray-900">{emergencyData?.casualties}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transcript */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mic className="h-5 w-5 mr-2" />
              Live Transcript
              {isRecording && (
                <span className="ml-2 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="ml-1 text-sm text-red-600">LIVE</span>
                </span>
              )}
            </h3>
            <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500 min-h-[100px]">
              {transcript ? (
                <p className="text-gray-700">"{transcript}"</p>
              ) : (
                <p className="text-gray-400 italic">
                  {isRecording 
                    ? "Listening... Start speaking to see your words appear here in real-time."
                    : "Transcript will appear here when you start speaking."
                  }
                </p>
              )}
            </div>
          </div>
        )}

        {/* Human Takeover Alert */}
        {emergencyData?.humanTakeover && (
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
          <h4 className="font-semibold text-yellow-800 mb-2">
            {speechError ? 'Text Input (Speech Recognition Issues)' : 'Text Input (Alternative Method)'}
          </h4>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder={speechError ? "Describe your emergency here..." : "Type a test message..."}
                className="flex-1 px-3 py-1 border rounded text-sm"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendTestMessage}
                disabled={!isConnected || !testMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm"
              >
                Send Text
              </button>
            </div>
            {speechError && (
              <p className="text-sm text-yellow-700">
                💡 Since speech recognition is having issues, please type your emergency details above and click "Send Text"
              </p>
            )}
            <button
              onClick={() => console.log('Emergency report submitted')}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Submit Report to Database
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
