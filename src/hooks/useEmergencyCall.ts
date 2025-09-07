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
    setError(null)
    setIsConnected(false)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) { 
        throw new Error('Gemini API key not found')
      }

      const agent = new EmergencyRealtimeAgent(apiKey)
      
      const callSession = await agent.startSession(
        (data: EmergencyData) => {
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
          setTranscript(transcriptUpdate)
        },
        (errorMessage: string) => {
          setSpeechError(errorMessage)
        },
        async (audioData: ArrayBuffer) => {
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

    } catch (error) {
      console.error('❌ Failed to start emergency call:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }, [])

  const sendTextMessage = useCallback((message: string) => {
    if (session) {
      session.sendMessage(message)
    }
  }, [session])

  const interrupt = useCallback(() => {
    // Implementation would depend on actual session
  }, [])

  const endCall = useCallback(async () => {
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
