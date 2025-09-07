'use client'

import { useState, useCallback } from 'react'
import { EmergencyRealtimeAgent, EmergencyData } from '@/lib/realtime-ai'

export interface EmergencyCallData {
  type: string
  severity: string
  description: string
  casualties: number
  location?: string
  latitude?: number
  longitude?: number
  transcript?: string
  autoEscalated?: boolean
  humanTakeover?: boolean
}

export function useEmergencyCall() {
  const [isConnected, setIsConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [emergencyData, setEmergencyData] = useState<EmergencyCallData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [session, setSession] = useState<any>(null)

  const startEmergencyCall = useCallback(async () => {
    console.log('🚀 Starting emergency call...')
    setError(null)
    setIsConnected(false)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      console.log("API KEY: " + apiKey) 
      if (!apiKey) { 
        throw new Error('Gemini API key not found')
      }

      const agent = new EmergencyRealtimeAgent(apiKey)
      
      const callSession = await agent.startSession(
        (data: EmergencyData) => {
          console.log('🔔 Emergency data received:', data)
          setEmergencyData({
            type: data.type,
            severity: data.severity,
            description: data.description,
            casualties: data.casualties || 0,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude
          })
        },
        (transcriptUpdate: string) => {
          console.log('📝 Transcript update:', transcriptUpdate)
          setTranscript(transcriptUpdate)
        },
        (errorMessage: string) => {
          console.log('⚠️ Speech recognition issue:', errorMessage)
          setSpeechError(errorMessage)
        },
        async (audioData: ArrayBuffer) => {
          console.log('🎵 Audio response received from TTS')
          setIsAIResponding(true)
          
          // Play the audio response
          await agent.playAudioBuffer(audioData)
          
          // Reset AI responding state after a delay
          setTimeout(() => {
            setIsAIResponding(false)
          }, 1000)
        }
      )

      setSession(callSession)
      setIsConnected(true)
      setIsRecording(true)
      console.log('✅ Emergency call session started')

    } catch (error) {
      console.error('❌ Failed to start emergency call:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }, [])

  const sendTextMessage = useCallback((message: string) => {
    if (session) {
      console.log('💬 Sending text message:', message)
      session.sendMessage(message)
    }
  }, [session])

  const interrupt = useCallback(() => {
    console.log('⚠️ Interrupting current response')
    // Implementation would depend on actual session
  }, [])

  const endCall = useCallback(async () => {
    console.log('📞 Ending emergency call...')
    if (session) {
      session.disconnect()
    }
    setIsConnected(false)
    setIsRecording(false)
    setTranscript('')
    setEmergencyData(null)
    setSpeechError(null)
    setIsAIResponding(false)
    setSession(null)
  }, [session])

  return {
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
  }
}
