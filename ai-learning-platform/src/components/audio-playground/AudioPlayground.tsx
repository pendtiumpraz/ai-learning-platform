'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Pause,
  Volume2,
  Download,
  RotateCcw,
  Mic,
  Settings,
  Headphones,
  Waveform,
  Zap
} from 'lucide-react'

interface VoiceSettings {
  rate: number
  pitch: number
  volume: number
  emphasis: number
  pauseDuration: number
}

interface AudioVisualizerProps {
  isPlaying: boolean
  audioData?: number[]
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, audioData = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (isPlaying && audioData.length > 0) {
      // Draw waveform
      const barWidth = width / audioData.length
      ctx.fillStyle = '#3b82f6'

      audioData.forEach((value, index) => {
        const barHeight = (value / 255) * height
        const x = index * barWidth
        const y = (height - barHeight) / 2

        ctx.fillRect(x, y, barWidth - 1, barHeight)
      })
    } else {
      // Draw idle state
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
    }
  }, [isPlaying, audioData])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={100}
      className="w-full h-24 border rounded-lg bg-gray-50"
    />
  )
}

export interface AudioPlaygroundProps {
  apiKey?: string
  onAudioGenerated?: (audioBlob: Blob, metadata: any) => void
}

export const AudioPlayground: React.FC<AudioPlaygroundProps> = ({
  apiKey,
  onAudioGenerated
}) => {
  const [text, setText] = useState('Welcome to the audio playground! This is an interactive demonstration of text-to-speech technology.')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioData, setAudioData] = useState<number[]>([])
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    emphasis: 1.0,
    pauseDuration: 500
  })

  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural')
  const [selectedFormat, setSelectedVoiceFormat] = useState('mp3')
  const [enableSSML, setEnableSSML] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const voices = [
    { id: 'en-US-JennyNeural', name: 'Jenny', language: 'English (US)', gender: 'Female' },
    { id: 'en-US-GuyNeural', name: 'Guy', language: 'English (US)', gender: 'Male' },
    { id: 'en-US-AriaNeural', name: 'Aria', language: 'English (US)', gender: 'Female' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia', language: 'English (UK)', gender: 'Female' },
    { id: 'es-ES-ElviraNeural', name: 'Elvira', language: 'Spanish', gender: 'Female' },
    { id: 'fr-FR-DeniseNeural', name: 'Denise', language: 'French', gender: 'Female' }
  ]

  const generateAudio = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setGenerationProgress(100)

      // Generate mock audio data for visualization
      const mockAudioData = Array.from({ length: 50 }, () =>
        Math.random() * 255
      )
      setAudioData(mockAudioData)

      // Create mock audio URL
      const mockAudioUrl = 'data:audio/mpeg;base64,SUQzAwAAAAAAIlRQRTEAAAAHAAAAU29mdHdhcmUAAAAAAAAAAAA='
      setAudioUrl(mockAudioUrl)

      // Create mock audio blob
      const mockBlob = new Blob(['mock audio data'], { type: 'audio/mp3' })
      onAudioGenerated?.(mockBlob, {
        text,
        voice: selectedVoice,
        settings: voiceSettings,
        duration: text.length * 0.1 // Rough estimate
      })

    } catch (error) {
      console.error('Error generating audio:', error)
    } finally {
      setIsGenerating(false)
      setTimeout(() => setGenerationProgress(0), 1000)
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const downloadAudio = () => {
    if (!audioUrl) return

    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `tts-output.${selectedFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetSettings = () => {
    setVoiceSettings({
      rate: 1.0,
      pitch: 1.0,
      volume: 0.8,
      emphasis: 1.0,
      pauseDuration: 500
    })
    setShowAdvanced(false)
    setSelectedVoice('en-US-JennyNeural')
    setSelectedVoiceFormat('mp3')
    setEnableSSML(false)
  }

  const currentVoice = voices.find(v => v.id === selectedVoice)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = voiceSettings.volume
      audioRef.current.playbackRate = voiceSettings.rate
    }
  }, [voiceSettings.volume, voiceSettings.rate])

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Text Input
          </CardTitle>
          <CardDescription>
            Enter the text you want to convert to speech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="min-h-[100px] resize-none"
            maxLength={5000}
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{text.length} / 5000 characters</span>
            <Button variant="outline" size="sm" onClick={() => setText('')}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Voice Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  selectedVoice === voice.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{voice.name}</div>
                <div className="text-sm text-muted-foreground">
                  {voice.language} • {voice.gender}
                </div>
              </button>
            ))}
          </div>

          {currentVoice && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{currentVoice.language}</Badge>
              <Badge variant="outline">{currentVoice.gender}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Voice Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Speed: {voiceSettings.rate.toFixed(1)}x</Label>
              <Slider
                value={[voiceSettings.rate]}
                onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, rate: value }))}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Pitch: {voiceSettings.pitch.toFixed(1)}</Label>
              <Slider
                value={[voiceSettings.pitch]}
                onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, pitch: value }))}
                min={0.5}
                max={1.5}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Volume: {Math.round(voiceSettings.volume * 100)}%</Label>
              <Slider
                value={[voiceSettings.volume]}
                onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, volume: value }))}
                min={0}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Emphasis: {voiceSettings.emphasis.toFixed(1)}</Label>
                <Slider
                  value={[voiceSettings.emphasis]}
                  onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, emphasis: value }))}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Pause Duration: {voiceSettings.pauseDuration}ms</Label>
                <Slider
                  value={[voiceSettings.pauseDuration]}
                  onValueChange={([value]) => setVoiceSettings(prev => ({ ...prev, pauseDuration: value }))}
                  min={100}
                  max={2000}
                  step={100}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ssml">Enable SSML</Label>
                <Switch
                  id="ssml"
                  checked={enableSSML}
                  onCheckedChange={setEnableSSML}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={resetSettings}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Generate Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateAudio}
            disabled={!text.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Generate Speech
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={generationProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Processing your request...
              </p>
            </div>
          )}

          {audioUrl && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Waveform className="w-4 h-4" />
                  Audio Visualization
                </h4>
                <AudioVisualizer isPlaying={isPlaying} audioData={audioData} />
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={togglePlayback} variant="outline">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button onClick={downloadAudio} variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-sm text-muted-foreground">
                  Audio ready • {Math.round(text.length * 0.1)}s estimated duration
                </div>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AudioPlayground