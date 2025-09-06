// Emergency AI Agent for 911 Call Handler
// Simplified version for hackathon demo

export interface EmergencyData {
  type: string
  severity: string
  description: string
  location?: string
  latitude?: number
  longitude?: number
  casualties?: number
}

export interface EmergencyContext {
  sessionId: string
  status: 'connecting' | 'connected' | 'disconnected'
  isRecording: boolean
  transcript: string
  emergencyData: EmergencyData | null
}

export class EmergencyRealtimeAgent {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    console.log('🤖 Emergency AI Agent initialized')
  }

  async startSession(onEmergencyDataExtracted: (data: EmergencyData) => void) {
    console.log('🚀 Starting emergency call session...')
    console.log('📞 Connecting to OpenAI Realtime API...')
    
    // For demo purposes, return a mock session
    return {
      id: 'session-' + Date.now(),
      status: 'connected',
      disconnect: () => {
        console.log('📞 Emergency call session disconnected')
      },
      sendMessage: (text: string) => {
        console.log('💬 Sending message:', text)
      }
    }
  }

  async createEphemeralToken(): Promise<string> {
    console.log('🔑 Creating ephemeral token...')
    
    try {
      const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-10-01',
          voice: 'alloy'
        })
      })

      const data = await response.json()
      console.log('✅ Token created successfully')
      return data.client_secret.value
    } catch (error) {
      console.error('❌ Token creation failed:', error)
      throw error
    }
  }

  // Process emergency information extracted from speech
  private async handleEmergencyInfo(data: EmergencyData) {
    console.log('🚨 Processing emergency information:', data)
    
    // Send to database
    const response = await fetch('/api/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: data.type,
        severity: data.severity,
        description: data.description,
        casualties: data.casualties || 0,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        autoEscalated: data.severity === 'CRITICAL',
        humanTakeover: data.severity === 'CRITICAL'
      })
    })

    if (response.ok) {
      const emergencyCall = await response.json()
      console.log('✅ Emergency call created:', emergencyCall.id)
    }
  }
}
