'use client'

import { useState, useEffect, useCallback } from 'react'
import { RealtimeEmergencyAgent, EmergencyContext } from '@/lib/realtime-ai'
import { AudioRecorder, AudioPlayer } from '@/lib/audio-utils'

export interface EmergencyCallData {
  type: string
  severity: string
  description: string
  casualties: number
  location: {
    latitude: number
    longitude: number
  } | null
  transcript: string
  autoEscalated: boolean
  humanTakeover: boolean
}

export interface UseEmergencyCallOptions {
  onEmergencyDataExtracted?: (data: Partial<EmergencyCallData>) => void
  onTranscriptionUpdate?: (transcript: string) => void
  onStatusChange?: (status: string) => void
  onError?: (error: string) => void
}

export function useEmergencyCall(options: UseEmergencyCallOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState('Disconnected')
  const [emergencyData, setEmergencyData] = useState<Partial<EmergencyCallData>>({})
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [aiAgent, setAiAgent] = useState<RealtimeEmergencyAgent | null>(null)
  const [audioRecorder] = useState(new AudioRecorder())
  const [audioPlayer] = useState(new AudioPlayer())

  const updateStatus = useCallback((newStatus: string) => {
    setStatus(newStatus)
    options.onStatusChange?.(newStatus)
  }, [options])

  const handleError = useCallback((errorMsg: string) => {
    setError(errorMsg)
    updateStatus(`Error: ${errorMsg}`)
    options.onError?.(errorMsg)
  }, [options, updateStatus])

  // Get user location
  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }, [])

  // Initialize emergency call
  const startEmergencyCall = useCallback(async () => {
    try {
      updateStatus('Getting location...')
      let location: { latitude: number; longitude: number } | null = null
      
      try {
        location = await getCurrentLocation()
        updateStatus('Location obtained. Connecting to AI agent...')
      } catch (locationError) {
        console.warn('Could not get location:', locationError)
        updateStatus('Connecting to AI agent...')
      }

      // Initialize audio systems
      await audioRecorder.initialize()
      await audioPlayer.initialize()

      // Create AI agent context
      const context: EmergencyContext = {
        location,
        timestamp: new Date().toISOString(),
        sessionId: `emergency_${Date.now()}`
      }

      const agent = new RealtimeEmergencyAgent({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        model: 'gpt-4-realtime-preview',
        voice: 'alloy'
      }, context)

      // Set up event handlers
      agent.onTranscription = (transcriptText: string) => {
        setTranscript(prev => prev + ' ' + transcriptText)
        options.onTranscriptionUpdate?.(transcript + ' ' + transcriptText)
      }

      agent.onEmergencyDataExtracted = (data: any) => {
        const newData = {
          type: data.emergency_type,
          severity: data.severity,
          description: data.description,
          casualties: data.casualties || 0,
          location,
          autoEscalated: data.requires_immediate_human_intervention || false,
          humanTakeover: false
        }
        
        setEmergencyData(prev => ({ ...prev, ...newData }))
        options.onEmergencyDataExtracted?.(newData)

        // Auto-escalate for critical situations
        if (data.severity === 'CRITICAL' || data.requires_immediate_human_intervention) {
          updateStatus('Critical situation detected - Connecting to human dispatcher...')
          setEmergencyData(prev => ({ ...prev, humanTakeover: true }))
        }
      }

      agent.onAudioResponse = async (audioBuffer: ArrayBuffer) => {
        try {
          await audioPlayer.playAudio(audioBuffer)
        } catch (audioError) {
          console.error('Error playing audio response:', audioError)
        }
      }

      agent.onError = (agentError: any) => {
        handleError(`AI Agent Error: ${agentError.message || agentError}`)
      }

      // Initialize AI agent
      await agent.initialize()
      setAiAgent(agent)
      setIsConnected(true)
      updateStatus('Connected to AI emergency agent')

    } catch (err) {
      handleError(`Failed to start emergency call: ${err}`)
    }
  }, [audioRecorder, audioPlayer, getCurrentLocation, handleError, updateStatus, options, transcript])

  // Start recording
  const startRecording = useCallback(() => {
    if (!aiAgent || !isConnected) return

    audioRecorder.startRecording((audioData: ArrayBuffer) => {
      aiAgent.sendAudio(audioData)
    })

    setIsRecording(true)
    updateStatus('Recording - Please speak clearly about your emergency')
  }, [aiAgent, isConnected, audioRecorder, updateStatus])

  // Stop recording
  const stopRecording = useCallback(() => {
    audioRecorder.stopRecording()
    setIsRecording(false)
    updateStatus('Processing your request...')
  }, [audioRecorder, updateStatus])

  // End emergency call
  const endCall = useCallback(() => {
    if (aiAgent) {
      aiAgent.disconnect()
      setAiAgent(null)
    }
    
    audioRecorder.cleanup()
    audioPlayer.cleanup()
    
    setIsConnected(false)
    setIsRecording(false)
    updateStatus('Call ended')
  }, [aiAgent, audioRecorder, audioPlayer, updateStatus])

  // Submit emergency report to database
  const submitEmergencyReport = useCallback(async (): Promise<boolean> => {
    try {
      const reportData = {
        ...emergencyData,
        transcript: transcript.trim(),
        location: emergencyData.location ? 
          `${emergencyData.location.latitude}, ${emergencyData.location.longitude}` : 
          'Location unavailable',
        latitude: emergencyData.location?.latitude,
        longitude: emergencyData.location?.longitude
      }

      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      updateStatus('Emergency report submitted successfully')
      return true
    } catch (err) {
      handleError(`Failed to submit report: ${err}`)
      return false
    }
  }, [emergencyData, transcript, updateStatus, handleError])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (aiAgent) aiAgent.disconnect()
      audioRecorder.cleanup()
      audioPlayer.cleanup()
    }
  }, [aiAgent, audioRecorder, audioPlayer])

  return {
    // State
    isConnected,
    isRecording,
    status,
    emergencyData,
    transcript,
    error,
    
    // Actions
    startEmergencyCall,
    startRecording,
    stopRecording,
    endCall,
    submitEmergencyReport,
    
    // Utils
    clearError: () => setError(null)
  }
}
