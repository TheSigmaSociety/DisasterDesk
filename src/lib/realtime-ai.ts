// OpenAI Realtime API Integration
// This file handles the real-time speech-to-speech communication with OpenAI

export interface RealtimeAIConfig {
  apiKey: string
  model: string
  voice: string
}

export interface EmergencyContext {
  location?: {
    latitude: number
    longitude: number
  }
  timestamp: string
  sessionId: string
}

export class RealtimeEmergencyAgent {
  private config: RealtimeAIConfig
  private websocket: WebSocket | null = null
  private context: EmergencyContext

  constructor(config: RealtimeAIConfig, context: EmergencyContext) {
    this.config = config
    this.context = context
  }

  async initialize(): Promise<void> {
    // Initialize WebSocket connection to OpenAI Realtime API
    const wsUrl = 'wss://api.openai.com/v1/realtime'
    
    this.websocket = new WebSocket(wsUrl, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    } as any)

    return new Promise((resolve, reject) => {
      if (!this.websocket) return reject(new Error('Failed to create WebSocket'))

      this.websocket.onopen = () => {
        this.sendInitialConfiguration()
        resolve()
      }

      this.websocket.onerror = (error) => {
        reject(error)
      }

      this.websocket.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data))
      }
    })
  }

  private sendInitialConfiguration(): void {
    if (!this.websocket) return

    // Configure the AI agent for emergency response
    const config = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: `You are an AI emergency dispatcher agent. Your role is to:
        1. Calmly gather essential emergency information
        2. Extract: location, emergency type, severity, casualties
        3. Maintain a professional, reassuring tone
        4. If the situation is life-threatening (high severity), inform the caller that you're connecting them to a human dispatcher
        5. Gather information efficiently but thoroughly
        
        Current caller location: ${this.context.location ? `${this.context.location.latitude}, ${this.context.location.longitude}` : 'Unknown'}
        
        Start by saying: "This is the emergency response AI agent. I'm here to help. Can you tell me what kind of emergency you're experiencing?"`,
        voice: this.config.voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        tools: [
          {
            type: 'function',
            name: 'extract_emergency_data',
            description: 'Extract structured emergency information from the conversation',
            parameters: {
              type: 'object',
              properties: {
                emergency_type: {
                  type: 'string',
                  enum: ['FIRE', 'MEDICAL', 'POLICE', 'ACCIDENT', 'NATURAL_DISASTER', 'HAZMAT', 'OTHER']
                },
                severity: {
                  type: 'string',
                  enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                },
                casualties: {
                  type: 'integer',
                  description: 'Number of people injured or affected'
                },
                description: {
                  type: 'string',
                  description: 'Brief description of the emergency'
                },
                requires_immediate_human_intervention: {
                  type: 'boolean',
                  description: 'Whether this emergency requires immediate human dispatcher intervention'
                }
              },
              required: ['emergency_type', 'severity', 'description']
            }
          }
        ]
      }
    }

    this.websocket.send(JSON.stringify(config))
  }

  private handleMessage(message: any): void {
    switch (message.type) {
      case 'session.created':
        console.log('Session created:', message.session)
        break
        
      case 'input_audio_buffer.speech_started':
        console.log('User started speaking')
        break
        
      case 'input_audio_buffer.speech_stopped':
        console.log('User stopped speaking')
        break
        
      case 'conversation.item.input_audio_transcription.completed':
        console.log('Transcription:', message.transcript)
        this.onTranscription(message.transcript)
        break
        
      case 'response.audio.delta':
        // Stream audio response to user
        this.playAudioChunk(message.delta)
        break
        
      case 'response.function_call_arguments.done':
        if (message.name === 'extract_emergency_data') {
          this.onEmergencyDataExtracted(JSON.parse(message.arguments))
        }
        break
        
      case 'error':
        console.error('Realtime API error:', message.error)
        this.onError(message.error)
        break
    }
  }

  sendAudio(audioData: ArrayBuffer): void {
    if (!this.websocket) return

    const message = {
      type: 'input_audio_buffer.append',
      audio: this.arrayBufferToBase64(audioData)
    }

    this.websocket.send(JSON.stringify(message))
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  private playAudioChunk(base64Audio: string): void {
    // Convert base64 to audio and play
    const audioData = atob(base64Audio)
    const audioBuffer = new ArrayBuffer(audioData.length)
    const audioView = new Uint8Array(audioBuffer)
    
    for (let i = 0; i < audioData.length; i++) {
      audioView[i] = audioData.charCodeAt(i)
    }

    // This would integrate with Web Audio API to play the audio
    this.onAudioResponse(audioBuffer)
  }

  // Event handlers - to be overridden by implementation
  onTranscription(transcript: string): void {
    console.log('Transcription received:', transcript)
  }

  onEmergencyDataExtracted(data: any): void {
    console.log('Emergency data extracted:', data)
  }

  onAudioResponse(audioBuffer: ArrayBuffer): void {
    console.log('Audio response received:', audioBuffer.byteLength, 'bytes')
  }

  onError(error: any): void {
    console.error('Emergency AI agent error:', error)
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  }
}
