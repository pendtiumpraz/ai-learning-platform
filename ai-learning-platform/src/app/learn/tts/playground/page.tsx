'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Play,
  Pause,
  Volume2,
  Settings,
  Download,
  RotateCcw,
  ArrowLeft,
  Mic,
  Zap,
  Globe,
  Code,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

interface Voice {
  id: string
  name: string
  language: string
  gender: string
  style: string
}

const voices: Voice[] = [
  { id: 'en-US-JennyNeural', name: 'Jenny', language: 'English (US)', gender: 'Female', style: 'Friendly' },
  { id: 'en-US-GuyNeural', name: 'Guy', language: 'English (US)', gender: 'Male', style: 'Professional' },
  { id: 'en-US-AriaNeural', name: 'Aria', language: 'English (US)', gender: 'Female', style: 'Expressive' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia', language: 'English (UK)', gender: 'Female', style: 'Calm' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', language: 'English (UK)', gender: 'Male', style: 'Energetic' },
  { id: 'es-ES-ElviraNeural', name: 'Elvira', language: 'Spanish (Spain)', gender: 'Female', style: 'Warm' },
  { id: 'fr-FR-DeniseNeural', name: 'Denise', language: 'French', gender: 'Female', style: 'Elegant' },
  { id: 'de-DE-KatjaNeural', name: 'Katja', language: 'German', gender: 'Female', style: 'Clear' },
]

const sampleTexts = [
  "Welcome to the Text-to-Speech playground! Here you can experiment with different voices and settings.",
  "Artificial intelligence is transforming how we interact with technology through natural language processing.",
  "The quick brown fox jumps over the lazy dog. This pangram contains all letters of the alphabet.",
  "Hello, world! This is a test of the text-to-speech synthesis system.",
  "Machine learning models can generate incredibly realistic human speech from text input."
]

export default function TTSPlaygroundPage() {
  const [text, setText] = useState("Welcome to the TTS playground! Type any text here and choose a voice to hear it come to life.")
  const [selectedVoice, setSelectedVoice] = useState<string>('en-US-JennyNeural')
  const [rate, setRate] = useState([1.0])
  const [pitch, setPitch] = useState([1.0])
  const [volume, setVolume] = useState([0.8])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('mp3')
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentVoice = voices.find(v => v.id === selectedVoice)

  const generateSpeech = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    try {
      // Simulate API call - in real implementation, this would call your TTS API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create a mock audio URL (in real implementation, this would be from the API response)
      const mockAudioUrl = 'data:audio/mpeg;base64,SUQzAwAAAAAAIlRQRTEAAAAHAAAAU29mdHdhcmUAAAAAAAAAAAA='
      setAudioUrl(mockAudioUrl)
    } catch (error) {
      console.error('Error generating speech:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlayPause = () => {
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
    setRate([1.0])
    setPitch([1.0])
    setVolume([0.8])
    setSelectedVoice('en-US-JennyNeural')
    setShowAdvanced(false)
    setSelectedFormat('mp3')
  }

  const loadSampleText = (sampleText: string) => {
    setText(sampleText)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] ?? 0.8
      audioRef.current.playbackRate = rate[0] ?? 1.0
    }
  }, [volume, rate])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/learn/tts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to TTS
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">TTS Playground</h1>
          <p className="text-muted-foreground">Experiment with text-to-speech in real-time</p>
        </div>
        <Badge variant="secondary">Interactive</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
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
                className="min-h-[120px] resize-none"
                maxLength={5000}
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{text.length} / 5000 characters</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setText('')}>
                    Clear
                  </Button>
                </div>
              </div>

              {/* Sample Texts */}
              <div>
                <Label className="text-sm font-medium">Try these sample texts:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sampleTexts.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleText(sample)}
                      className="text-xs"
                    >
                      {index === 0 ? 'Welcome' :
                       index === 1 ? 'AI Tech' :
                       index === 2 ? 'Alphabet' :
                       index === 3 ? 'Hello' : 'ML Speech'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Selection
              </CardTitle>
              <CardDescription>
                Choose the voice that best fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {voice.language} • {voice.gender} • {voice.style}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentVoice && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{currentVoice.language}</Badge>
                  <Badge variant="outline">{currentVoice.gender}</Badge>
                  <Badge variant="outline">{currentVoice.style}</Badge>
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
              <div className="space-y-2">
                <Label>Speed: {(rate[0] ?? 1.0).toFixed(1)}x</Label>
                <Slider
                  value={rate}
                  onValueChange={setRate}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Pitch: {(pitch[0] ?? 1.0).toFixed(1)}</Label>
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Volume: {Math.round((volume[0] ?? 0.8) * 100)}%</Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  min={0}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {showAdvanced && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Audio Format</Label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3">MP3</SelectItem>
                        <SelectItem value="wav">WAV</SelectItem>
                        <SelectItem value="ogg">OGG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" onClick={resetSettings}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Generate Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Generate Speech
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generateSpeech}
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
                    <Play className="w-4 h-4 mr-2" />
                    Generate Speech
                  </>
                )}
              </Button>

              {audioUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={togglePlayPause}
                      variant="outline"
                      className="flex-1"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={downloadAudio}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
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

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-700">
                  💡 Use punctuation like commas and periods to create natural pauses in speech.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-700">
                  🎯 Try different speeds for different contexts - slower for educational content, faster for quick notifications.
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-700">
                  🔊 Adjust the pitch to match the emotion you want to convey.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/learn/tts/examples">
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  View Code Examples
                </Button>
              </Link>
              <Link href="/learn/tts/voices">
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Voice Gallery
                </Button>
              </Link>
              <Link href="/learn/tts/basics">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Back to Basics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}