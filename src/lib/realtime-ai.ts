// Emergency AI Agent for 911 Call Handler  
// Using Gemini 2.5 Flash Lite for data extraction and response generation + Gemini 2.5 Flash Preview TTS for speech

import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenAI } from '@google/genai'

export interface ConversationTurn {
  timestamp: number
  speaker: 'caller' | 'dispatcher'
  text: string
}

export interface EmergencyData {
  type: string
  severity: string
  description: string
  location?: string
  latitude?: number
  longitude?: number
  casualties?: number
}

export interface EmergencySession {
  sessionId: string
  conversationHistory: ConversationTurn[]
  extractedData: EmergencyData | null
  lastProcessedAt: number
}

export interface EmergencyContext {
  sessionId: string
  status: 'connecting' | 'connected' | 'disconnected'
  isRecording: boolean
  transcript: string
  emergencyData: EmergencyData | null
}

export class EmergencyRealtimeAgent {
  private genAI: GoogleGenerativeAI
  private ttsAI: GoogleGenAI
  private textModel: any
  private recognition: any = null
  private isListening: boolean = false
  private audioContext: AudioContext | null = null
  private currentSession: EmergencySession | null = null
  private ttsQueue: Array<{ text: string; onAudioReceived: (audioData: ArrayBuffer) => void }> = []
  private isTTSProcessing: boolean = false
  private emergencyCallId: string | null = null

  constructor(apiKey: string) {
    // Gemini 2.5 Flash Lite for data extraction and response generation
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.textModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    
    // Gemini 2.5 Flash Preview TTS for speech synthesis
    this.ttsAI = new GoogleGenAI({ apiKey })
    
    console.log('🤖 Emergency AI Agent initialized with Gemini 2.5 Flash Lite + 2.5 Flash Preview TTS')
    this.initializeSpeechRecognition()
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      console.log('🔊 Audio context initialized for TTS output')
    }
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
      console.log('🎤 Speech recognition initialized')
    } else {
      console.warn('⚠️ Speech recognition not supported in this browser')
    }
  }

  async startSession(
    onEmergencyDataExtracted: (data: EmergencyData) => void,
    onTranscriptUpdate?: (transcript: string) => void,
    onError?: (error: string) => void,
    onAudioReceived?: (audioData: ArrayBuffer) => void
  ) {
    console.log('🚀 Starting emergency call session...')
    
    // Create a session for emergency call processing with conversation history
    const sessionId = 'session-' + Date.now()
    this.currentSession = {
      sessionId,
      conversationHistory: [],
      extractedData: null,
      lastProcessedAt: 0
    }
    
    // Reset emergency call ID for new session
    this.emergencyCallId = null
    
    try {
      // Play opening 911 greeting immediately
      if (onAudioReceived) {
        const openingGreeting = "Hello this is 911, what's your emergency?"
        console.log('📞 Playing opening 911 greeting')
        
        // Add opening greeting to conversation history
        this.currentSession.conversationHistory.push({
          timestamp: Date.now(),
          speaker: 'dispatcher',
          text: openingGreeting
        })
        
        // Queue the opening greeting for immediate playback
        this.queueTTSGeneration(openingGreeting, onAudioReceived)
      }

      // Start speech recognition if available
      if (this.recognition && onTranscriptUpdate) {
        this.startSpeechRecognition(onEmergencyDataExtracted, onTranscriptUpdate, onError, onAudioReceived)
      } else if (onError) {
        onError('Speech recognition not available in this browser. You can still use the text input below.')
      }
    } catch (error) {
      console.error('❌ Failed to initialize session:', error)
      if (onError) {
        onError('Failed to start session. Using fallback mode.')
      }
    }
    
    return {
      id: sessionId,
      status: 'connected' as const,
      disconnect: () => {
        console.log('📞 Emergency call session disconnected')
        this.stopSpeechRecognition()
        this.currentSession = null
      },
      sendMessage: async (text: string) => {
        console.log('💬 Processing message:', text)
        if (onTranscriptUpdate) {
          onTranscriptUpdate(text)
        }
        
        // Add caller message to conversation history
        if (this.currentSession) {
          this.currentSession.conversationHistory.push({
            timestamp: Date.now(),
            speaker: 'caller',
            text: text
          })
        }
        
        // Process with full conversation context
        await this.processEmergencyText(text, onEmergencyDataExtracted, onAudioReceived)
      }
    }
  }

  private startSpeechRecognition(
    onEmergencyDataExtracted: (data: EmergencyData) => void,
    onTranscriptUpdate: (transcript: string) => void, 
    onError?: (error: string) => void,
    onAudioReceived?: (audioData: ArrayBuffer) => void
  ) {
    if (!this.recognition) {
      console.warn('⚠️ Speech recognition not available')
      if (onError) {
        onError('Speech recognition not supported in this browser')
      }
      return
    }

    let finalTranscript = ''

    this.recognition.onresult = (event: any) => {
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
          console.log('🎤 Final transcript chunk:', transcript)
          
          // Add caller message to conversation history
          if (this.currentSession) {
            this.currentSession.conversationHistory.push({
              timestamp: Date.now(),
              speaker: 'caller',
              text: transcript.trim()
            })
          }
          
          // Process with full conversation context - but only if enough time has passed
          // This prevents processing every small chunk and allows for natural speech pauses
          const now = Date.now()
          if (!this.currentSession?.lastProcessedAt || (now - this.currentSession.lastProcessedAt) > 2000) {
            if (this.currentSession) {
              this.currentSession.lastProcessedAt = now
            }
            this.processEmergencyText(transcript, onEmergencyDataExtracted, onAudioReceived)
          }
          
          // Update the full transcript
          onTranscriptUpdate(finalTranscript.trim())
        } else {
          interimTranscript = transcript
        }
      }
      
      // Update with interim results for real-time display
      if (interimTranscript) {
        console.log('🎤 Interim transcript:', interimTranscript)
        onTranscriptUpdate((finalTranscript+interimTranscript).trim())
      }
    }

    this.recognition.onerror = (event: any) => {
      console.error('❌ Speech recognition error:', event.error)
      
      if (event.error === 'network') {
        console.log('🌐 Network error detected')
        if (onError) {
          onError('Network connection issue. Speech recognition stopped. You can use the text input below.')
        }
        this.isListening = false
      } else if (event.error === 'not-allowed') {
        console.error('❌ Microphone access denied')
        this.isListening = false
        if (onError) {
          onError('Microphone access denied. Please allow microphone access or use the text input below.')
        }
      } else if (event.error === 'no-speech') {
        console.log('⏸️ No speech detected, continuing to listen...')
        // Don't stop listening for no-speech errors
      } else {
        console.log('❌ Speech recognition error:', event.error)
        if (onError) {
          onError(`Speech recognition error: ${event.error}. Please use the text input below.`)
        }
        this.isListening = false
      }
    }

    this.recognition.onend = () => {
      if (this.isListening) {
        console.log('🔄 Speech recognition ended, restarting...')
        setTimeout(() => {
          if (this.isListening) {
            try {
              this.recognition.start()
            } catch (error) {
              console.error('❌ Failed to restart speech recognition:', error)
            }
          }
        }, 100)
      }
    }

    this.isListening = true
    this.recognition.start()
    console.log('🎤 Speech recognition started')
  }

  private stopSpeechRecognition() {
    if (this.recognition && this.isListening) {
      this.isListening = false
      this.recognition.stop()
      console.log('🛑 Speech recognition stopped')
    }
  }

  private async processEmergencyText(
    currentText: string, 
    onEmergencyDataExtracted: (data: EmergencyData) => void,
    onAudioReceived?: (audioData: ArrayBuffer) => void
  ) {
    if (!this.currentSession) {
      console.warn('⚠️ No active session for processing text')
      return
    }

    try {
      // Build conversation context
      const conversationContext = this.buildConversationContext()
      const hasExistingEmergencyData = this.currentSession.extractedData !== null
      
      // Enhanced prompt with full conversation context
      const prompt = `
You are an experienced 911 emergency dispatcher AI. You are currently handling an emergency call.

CONVERSATION HISTORY:
${conversationContext}

CURRENT EMERGENCY STATUS:
${hasExistingEmergencyData ? `Already extracted: ${JSON.stringify(this.currentSession.extractedData)}` : 'No emergency data extracted yet'}

CURRENT CALLER STATEMENT: "${currentText}"

Based on the FULL conversation history and the current statement, you need to:
1. ${hasExistingEmergencyData ? 'Update or maintain' : 'Extract'} emergency information as JSON
2. Generate a professional dispatcher response that flows naturally from the conversation

Please return EXACTLY this format (no additional text or markdown):
{
  "emergencyData": {
    "type": "FIRE" | "MEDICAL" | "POLICE" | "NATURAL_DISASTER" | "ACCIDENT" | "OTHER",
    "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "description": "Brief description of the emergency based on ALL information gathered",
    "location": "Most specific address or location mentioned in the conversation",
    "casualties": number of people injured/affected (0 if not mentioned),
    "latitude": latitude if extractable from location,
    "longitude": longitude if extractable from location
  },
  "dispatcherResponse": "Your professional response that references previous conversation if relevant, asks follow-up questions if needed, and maintains the natural flow of the emergency call conversation."
}

IMPORTANT GUIDELINES:
- Don't repeat questions you've already asked unless you need clarification
- Time is of the essence. The response you give to the caller MUST be VERY SHORT and EFFICIENT. 
- Do NOT repeat what the caller just said.
- Keep your response in one (preferred) or two sentences MAXIMUM. 
- Build upon information already gathered
- If emergency data is already complete, focus on providing reassurance and instructions
- If the caller is providing new information, acknowledge it and ask logical follow-up questions
- Maintain a calm, professional, and reassuring tone throughout
- If no clear emergency information exists, set emergencyData to null but provide helpful guidance

${hasExistingEmergencyData ? 'Note: Emergency data already exists. Only update it if the caller provides NEW or CORRECTING information.' : ''}
`

      const result = await this.textModel.generateContent(prompt)
      const response = await result.response
      const responseText = response.text()
      
      console.log('🤖 Gemini 2.5 Flash Lite response with context:', responseText)
      
      try {
        // Clean the response to remove markdown code blocks if present
        let cleanedResponse = responseText.trim()
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        let parsedResponse = JSON.parse(cleanedResponse)

        // Geocode for most accurate location
        if(parsedResponse.emergencyData.latitude == null || parsedResponse.emergencyData.longitude == null) {
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsedResponse.emergencyData.location)}`)
            if (geoRes.ok) {
              const geoData = await geoRes.json()
              if (geoData && geoData.length > 0) {
                parsedResponse.emergencyData.latitude = parseFloat(geoData[0].lat)
                parsedResponse.emergencyData.longitude = parseFloat(geoData[0].lon)

                // use api to convert lat and long into locattion
                if (
                  parsedResponse.emergencyData.latitude != null &&
                  parsedResponse.emergencyData.longitude != null
                ) {
                  try {
                    const reverseGeoRes = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${parsedResponse.emergencyData.latitude}&lon=${parsedResponse.emergencyData.longitude}`
                    );
                    if (reverseGeoRes.ok) {
                      const reverseGeoData = await reverseGeoRes.json();
                      if (reverseGeoData && reverseGeoData.display_name) {
                        console.log("location: " + reverseGeoData.display_name);
                        parsedResponse.emergencyData.location = reverseGeoData.display_name;
                      }
                    }
                  } catch (reverseGeoError) {
                    console.warn('⚠️ Reverse geocoding failed:', reverseGeoError);
                  }
                }
              }
            }
          } catch (geoError) {
            console.warn('⚠️ Geocoding failed:', geoError)
          }
        }

        // Handle emergency data extraction/update
        if (parsedResponse.emergencyData && parsedResponse.emergencyData.type) {
          const isNewData = !this.currentSession.extractedData
          const isUpdatedData = isNewData || JSON.stringify(this.currentSession.extractedData) !== JSON.stringify(parsedResponse.emergencyData)

          if (isUpdatedData) {
            console.log('🚨 Emergency data ' + (isNewData ? 'extracted' : 'updated') + ':', parsedResponse.emergencyData)
            this.currentSession.extractedData = parsedResponse.emergencyData
            onEmergencyDataExtracted(parsedResponse.emergencyData)

            // Always update database when emergency data changes
            await this.handleEmergencyInfo(parsedResponse.emergencyData, isNewData)
          }
        }

        // Handle conversational response through TTS
        if (parsedResponse.dispatcherResponse && onAudioReceived) {
          console.log('💬 Generating contextual speech response:', parsedResponse.dispatcherResponse)

          // Add dispatcher response to conversation history
          this.currentSession.conversationHistory.push({
            timestamp: Date.now(),
            speaker: 'dispatcher',
            text: parsedResponse.dispatcherResponse
          })

          // Queue TTS generation to maintain order
          this.queueTTSGeneration(parsedResponse.dispatcherResponse, onAudioReceived)
        }

      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response as JSON:', parseError)
        console.log('Raw response:', responseText)

        // Fallback: treat the entire response as dispatcher response
        if (onAudioReceived) {
          const fallbackResponse = "I understand you're experiencing an emergency. Please provide me with your location and describe what's happening."

          // Add fallback response to conversation history
          this.currentSession.conversationHistory.push({
            timestamp: Date.now(),
            speaker: 'dispatcher',
            text: fallbackResponse
          })

          // Queue TTS generation to maintain order
          this.queueTTSGeneration(fallbackResponse, onAudioReceived)
        }
      }
    } catch (error) {
      console.error('❌ Error processing text with conversation context:', error)
    }
  }

  // Helper method to build conversation context string
  private buildConversationContext(): string {
    if (!this.currentSession || this.currentSession.conversationHistory.length === 0) {
      return "[Start of call]"
    }

    // Get the last 10 conversation turns for context (to avoid token limits)
    const recentHistory = this.currentSession.conversationHistory.slice(-10)
    
    return recentHistory
      .map(turn => `${turn.speaker.toUpperCase()}: "${turn.text}"`)
      .join('\n')
  }

  // Method to manually process conversation when needed (e.g., after longer pauses or explicit user input)
  async processFullConversation(
    onEmergencyDataExtracted: (data: EmergencyData) => void,
    onAudioReceived?: (audioData: ArrayBuffer) => void
  ) {
    if (!this.currentSession) {
      console.warn('⚠️ No active session for processing full conversation')
      return
    }

    // Get the most recent caller statement
    const recentCallerMessages = this.currentSession.conversationHistory
      .filter(turn => turn.speaker === 'caller')
      .slice(-3) // Get last 3 caller statements for context
      .map(turn => turn.text)
      .join(' ')

    if (recentCallerMessages.trim()) {
      console.log('🔄 Processing full conversation context...')
      await this.processEmergencyText(recentCallerMessages, onEmergencyDataExtracted, onAudioReceived)
    }
  }

  // Get current session state for debugging
  getCurrentSession(): EmergencySession | null {
    return this.currentSession
  }

  // Generate speech response using Gemini 2.5 Flash Preview TTS
  private async generateSpeechResponse(text: string, onAudioReceived: (audioData: ArrayBuffer) => void) {
    try {
      console.log('🎙️ Converting text to speech:', text)
      
      const response = await this.ttsAI.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in a calm, but fast, professional dispatcher voice: ${text}` }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Using "Kore - Firm" voice for authority
             
            },
            
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const audioBuffer = Buffer.from(audioData, 'base64');
        console.log('🔊 TTS audio generated successfully, size:', audioBuffer.length, 'bytes')
        console.log('✅ AI finished processing TTS for:', text.substring(0, 50) + (text.length > 50 ? '...' : ''))
        onAudioReceived(audioBuffer.buffer);
      } else {
        console.warn('⚠️ No audio data received from TTS model')
      }
    } catch (error) {
      console.error('❌ Error generating speech with TTS:', error)
      console.log('❌ AI failed to process TTS for:', text.substring(0, 50) + (text.length > 50 ? '...' : ''))
    }
  }

  // Queue TTS generation to maintain proper order
  private queueTTSGeneration(text: string, onAudioReceived: (audioData: ArrayBuffer) => void) {
    this.ttsQueue.push({ text, onAudioReceived })
    this.processTTSQueue()
  }

  // Process TTS queue in order
  private async processTTSQueue() {
    if (this.isTTSProcessing || this.ttsQueue.length === 0) {
      return
    }

    console.log('🔄 Starting TTS queue processing, items in queue:', this.ttsQueue.length)
    this.isTTSProcessing = true

    while (this.ttsQueue.length > 0) {
      const { text, onAudioReceived } = this.ttsQueue.shift()!
      await this.generateSpeechResponse(text, onAudioReceived)
    }

    this.isTTSProcessing = false
    console.log('✅ TTS queue processing completed, queue is now empty')
  }

  // Process emergency information extracted from speech/text
  private async handleEmergencyInfo(data: EmergencyData, isNewData: boolean = true) {
    console.log('🚨 Processing emergency information:', data)
    
    if (isNewData || !this.emergencyCallId) {
      // Create new emergency call
      await this.createEmergencyCall(data)
    } else {
      // Update existing emergency call
      await this.updateEmergencyCall(data)
    }
  }

  // Create new emergency call in database
  private async createEmergencyCall(data: EmergencyData) {
    try {
      console.log('📝 Creating new emergency call in database')
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
        this.emergencyCallId = emergencyCall.id
        console.log('✅ Emergency call created:', emergencyCall.id)
      } else {
        console.error('❌ Failed to create emergency call:', await response.text())
      }
    } catch (error) {
      console.error('❌ Error creating emergency call:', error)
    }
  }

  // Update existing emergency call in database
  private async updateEmergencyCall(data: EmergencyData) {
    if (!this.emergencyCallId) {
      console.warn('⚠️ No emergency call ID available for update, creating new call')
      await this.createEmergencyCall(data)
      return
    }

    try {
      console.log('🔄 Updating emergency call in database, ID:', this.emergencyCallId)
      const response = await fetch(`/api/emergency/${this.emergencyCallId}`, {
        method: 'PATCH',
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
        const updatedCall = await response.json()
        console.log('✅ Emergency call updated:', updatedCall.id)
      } else {
        console.error('❌ Failed to update emergency call:', await response.text())
      }
    } catch (error) {
      console.error('❌ Error updating emergency call:', error)
    }
  }

  // Generate emergency response suggestions (legacy method for backward compatibility with conversation context)
  async generateResponse(transcript: string, emergencyData: EmergencyData | null): Promise<string> {
    try {
      const conversationContext = this.buildConversationContext()
      
      const prompt = `
You are a professional 911 emergency dispatcher. Based on the following conversation context and information, provide a calm, professional response to help the caller.

CONVERSATION HISTORY:
${conversationContext}

Current full transcript: "${transcript}"
Emergency data: ${emergencyData ? JSON.stringify(emergencyData) : 'None extracted yet'}

Provide a helpful, calming response that:
1. Acknowledges the emergency and references the conversation flow
2. Asks for clarification if needed (but don't repeat questions already asked)
3. Provides immediate safety instructions if appropriate
4. Reassures the caller that help is on the way
5. Flows naturally from the previous conversation

Keep the response concise and professional. Reference previous parts of the conversation when appropriate.
`

      const result = await this.textModel.generateContent(prompt)
      const response = await result.response
      const responseText = response.text()
      
      // Add this response to conversation history if we have an active session
      if (this.currentSession) {
        this.currentSession.conversationHistory.push({
          timestamp: Date.now(),
          speaker: 'dispatcher',
          text: responseText
        })
      }
      
      return responseText
    } catch (error) {
      console.error('❌ Error generating response:', error)
      const fallbackResponse = "I understand this is an emergency. Please stay on the line and provide as much detail as possible about your location and the situation."
      
      // Add fallback response to conversation history
      if (this.currentSession) {
        this.currentSession.conversationHistory.push({
          timestamp: Date.now(),
          speaker: 'dispatcher',
          text: fallbackResponse
        })
      }
      
      return fallbackResponse
    }
  }

  // Audio playback utility for TTS responses
  async playAudioBuffer(audioBuffer: ArrayBuffer) {
    if (!this.audioContext) {
      console.warn('⚠️ Audio context not available')
      return
    }

    try {
      console.log('🔊 Playing TTS audio as PCM...')
      const audioData = new Int16Array(audioBuffer)
      
      // Create audio buffer (assuming 24kHz for consistency with Gemini TTS)
      const buffer = this.audioContext.createBuffer(1, audioData.length, 24000)
      const channelData = buffer.getChannelData(0)
      
      // Convert Int16Array to Float32Array and normalize
      for (let i = 0; i < audioData.length; i++) {
        channelData[i] = audioData[i] / 32768.0
      }
      
      // Play the audio
      const source = this.audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(this.audioContext.destination)
      source.start()
      
      console.log('🔊 PCM audio playback successful')
    } catch (error) {
      console.error('❌ Error playing PCM audio:', error)
    }
  }
}