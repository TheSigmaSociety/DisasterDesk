// Audio utilities for emergency call handling

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null

  async initialize(): Promise<void> {
    console.log('🎤 AudioRecorder: Initializing microphone access...')
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      })
      console.log('✅ Microphone access granted')
      console.log('🎛️ Audio track settings:', this.stream.getAudioTracks()[0]?.getSettings())
    } catch (error) {
      console.error('❌ Failed to access microphone:', error)
      throw new Error('Failed to access microphone: ' + error)
    }
  }

  startRecording(onDataAvailable?: (audioData: ArrayBuffer) => void): void {
    if (!this.stream) {
      console.error('❌ Cannot start recording: Audio stream not initialized')
      throw new Error('Audio not initialized')
    }

    console.log('🎙️ Starting audio recording...')
    this.audioChunks = []
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm;codecs=opus'
    })

    console.log('📊 MediaRecorder state:', this.mediaRecorder.state)

    this.mediaRecorder.ondataavailable = (event) => {
      console.log('🎵 Audio data available:', event.data.size, 'bytes')
      if (event.data.size > 0) {
        this.audioChunks.push(event.data)
        
        if (onDataAvailable) {
          // Convert blob to ArrayBuffer for real-time processing
          event.data.arrayBuffer().then((buffer) => {
            console.log('🔄 Converting audio data to ArrayBuffer:', buffer.byteLength, 'bytes')
            onDataAvailable(buffer)
          })
        }
      }
    }

    this.mediaRecorder.start(100) // Collect data every 100ms for real-time processing
    console.log('✅ Recording started successfully')
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  cleanup(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop()
      this.mediaRecorder = null
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    this.audioChunks = []
  }
}

export class AudioPlayer {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null

  async initialize(): Promise<void> {
    console.log('🔊 AudioPlayer: Initializing Web Audio API...')
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)
    console.log('✅ AudioPlayer initialized')
    console.log('🎛️ Audio context state:', this.audioContext.state)
    console.log('📊 Sample rate:', this.audioContext.sampleRate)
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext || !this.gainNode) {
      console.error('❌ Cannot play audio: AudioPlayer not initialized')
      throw new Error('Audio player not initialized')
    }

    console.log('🔊 Playing audio buffer:', audioBuffer.byteLength, 'bytes')

    try {
      const decodedBuffer = await this.audioContext.decodeAudioData(audioBuffer.slice(0))
      console.log('✅ Audio decoded successfully')
      console.log('📊 Decoded audio info: channels:', decodedBuffer.numberOfChannels, 'duration:', decodedBuffer.duration)
      
      const source = this.audioContext.createBufferSource()
      source.buffer = decodedBuffer
      source.connect(this.gainNode)
      source.start()
      console.log('🎵 Audio playback started')
    } catch (error) {
      console.error('❌ Error playing audio:', error)
      throw error
    }
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext!.currentTime)
    }
  }

  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.gainNode = null
  }
}
