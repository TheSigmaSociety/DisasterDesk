// Audio utilities for emergency call handling

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null

  async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      })
    } catch (error) {
      throw new Error('Failed to access microphone: ' + error)
    }
  }

  startRecording(onDataAvailable?: (audioData: ArrayBuffer) => void): void {
    if (!this.stream) {
      throw new Error('Audio not initialized')
    }

    this.audioChunks = []
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm;codecs=opus'
    })


    this.mediaRecorder.ondataavailable = (event) => {
      console.log('🎵 Audio data available:', event.data.size, 'bytes')
      if (event.data.size > 0) {
        this.audioChunks.push(event.data)
        
        if (onDataAvailable) {
          // Convert blob to ArrayBuffer for real-time processing
          event.data.arrayBuffer().then((buffer) => {
            onDataAvailable(buffer)
          })
        }
      }
    }

    this.mediaRecorder.start(100) // Collect data every 100ms for real-time processing
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
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext || !this.gainNode) {
      throw new Error('Audio player not initialized')
    }


    try {
      const decodedBuffer = await this.audioContext.decodeAudioData(audioBuffer.slice(0))
      
      const source = this.audioContext.createBufferSource()
      source.buffer = decodedBuffer
      source.connect(this.gainNode)
      source.start()
    } catch (error) {
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
