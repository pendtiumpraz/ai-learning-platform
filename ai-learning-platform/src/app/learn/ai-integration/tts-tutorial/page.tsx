"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import {
  ArrowLeft,
  Copy,
  Play,
  Pause,
  Volume2,
  Download,
  CheckCircle,
  AlertCircle,
  Code,
  Zap,
  Globe,
  Shield,
  Mic,
  Settings,
  Headphones
} from 'lucide-react'

const TTS_TUTORIAL_CONTENT = {
  introduction: {
    title: "Text-to-Speech (TTS) Implementation",
    description: "Master voice generation with modern TTS APIs and browser capabilities",
    duration: "30 minutes",
    difficulty: "beginner",
    objectives: [
      "Understand TTS technology and available options",
      "Use Web Speech API for browser-native TTS",
      "Integrate ElevenLabs API for premium voices",
      "Handle audio generation and playback",
      "Implement voice customization and controls"
    ]
  },
  sections: [
    {
      id: "basics",
      title: "TTS Fundamentals",
      content: `
# Understanding Text-to-Speech Technology

## What is TTS?

Text-to-Speech (TTS) technology converts written text into spoken audio. Modern TTS systems use deep learning to create natural-sounding human voices.

## Types of TTS Solutions

### 1. Browser Native (Web Speech API)
- **Pros**: Free, no API keys needed, works offline
- **Cons**: Limited voice options, browser-dependent
- **Best for**: Simple applications, demos, internal tools

### 2. Cloud-based APIs (ElevenLabs, Google, AWS)
- **Pros**: High quality voices, customization, extensive features
- **Cons**: Requires API keys, costs money, internet needed
- **Best for**: Production applications, premium user experience

### 3. Self-hosted (Coqui, Mozilla TTS)
- **Pros**: Full control, no ongoing costs, privacy
- **Cons**: Complex setup, requires infrastructure
- **Best for**: Enterprise applications, privacy-focused needs

## Voice Characteristics

- **Voice ID**: Unique identifier for each voice
- **Language**: Supported languages (English, Spanish, French, etc.)
- **Accent**: Regional variations (US, UK, Australian, etc.)
- **Gender**: Male, female, or neutral voices
- **Age**: Child, adult, or elderly voice characteristics
- **Style**: Professional, casual, news, conversational, etc.
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "TTS Service Structure",
          code: `// services/tts-service.js
class TTSService {
  constructor() {
    this.voices = [];
    this.isSupported = 'speechSynthesis' in window;
    this.currentVoice = null;
    this.settings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      lang: 'en-US'
    };
  }

  // Initialize TTS service
  async init() {
    if (!this.isSupported) {
      throw new Error('TTS not supported in this browser');
    }

    // Load available voices
    this.loadVoices();

    // Listen for voice changes
    window.speechSynthesis.onvoiceschanged = () => {
      this.loadVoices();
    };

    return this.isSupported;
  }

  // Load available voices
  loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', this.voices.length);
  }

  // Get voices by language
  getVoicesByLanguage(language = 'en-US') {
    return this.voices.filter(voice => voice.lang.startsWith(language));
  }

  // Set voice settings
  setSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }

  // Generate speech (to be implemented)
  speak(text, options = {}) {
    // Implementation in next sections
  }
}

export default TTSService;`,
          description: "Basic TTS service structure with browser support detection"
        }
      ]
    },
    {
      id: "browser-tts",
      title: "Browser Native TTS",
      content: `
# Implementing Browser Native TTS

The Web Speech API provides built-in text-to-speech functionality in modern browsers. This is perfect for quick prototyping and applications that don't require premium voice quality.

## Web Speech API Overview

The Speech Synthesis API consists of two main interfaces:
- **SpeechSynthesis**: Controller for the speech synthesis service
- **SpeechSynthesisUtterance**: Represents a speech request

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | Full | Excellent support |
| Firefox | Limited | Linux support poor |
| Safari | Good | iOS and macOS |
| Edge | Full | Chromium-based |

## Basic Implementation

Let's create a complete TTS implementation with controls:
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "Complete Browser TTS Implementation",
          code: `// components/TTSSpeaker.js
import React, { useState, useEffect, useRef } from 'react';

const TTSSpeaker = ({ text, autoPlay = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);

  const utteranceRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      // Load voices
      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);

        // Set default voice (first English voice)
        const englishVoice = availableVoices.find(
          voice => voice.lang.includes('en')
        );
        if (englishVoice) {
          setSelectedVoice(englishVoice);
        }
      };

      loadVoices();

      // Voices might load asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = () => {
    if (!synthRef.current || !text.trim()) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Configure utterance
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Event listeners
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    // Start speaking
    synthRef.current.speak(utterance);
  };

  const pause = () => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
    }
  };

  const resume = () => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
    }
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const downloadAudio = async () => {
    // Note: Browser TTS doesn't support direct audio download
    // This would require using a server-side TTS service
    alert('Audio download requires cloud TTS service. See ElevenLabs section.');
  };

  return (
    <div className="tts-speaker bg-white rounded-lg shadow-lg p-6 space-y-4">
      {/* Voice Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Voice:</label>
        <Select
          value={selectedVoice?.name || ''}
          onValueChange={(voiceName) => {
            const voice = voices.find(v => v.name === voiceName);
            setSelectedVoice(voice);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Speed: {rate.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {!isSpeaking ? (
          <Button onClick={speak} className="flex-1">
            <Volume2 className="w-4 h-4 mr-2" />
            Speak
          </Button>
        ) : !isPaused ? (
          <Button onClick={pause} variant="outline" className="flex-1">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        ) : (
          <Button onClick={resume} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Resume
          </Button>
        )}

        <Button onClick={stop} variant="outline">
          <Volume2 className="w-4 h-4" />
        </Button>

        <Button onClick={downloadAudio} variant="outline">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Status */}
      {isSpeaking && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-pulse">
              <Volume2 className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-sm text-green-600">
              {isPaused ? 'Paused' : 'Speaking...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TTSSpeaker;`,
          description: "Complete React component with full TTS controls"
        },
        {
          language: "javascript",
          title: "Advanced TTS with Queue Management",
          code: `// services/advanced-tts.js
class AdvancedTTS {
  constructor() {
    this.speechQueue = [];
    this.isProcessing = false;
    this.currentUtterance = null;
    this.callbacks = {};
    this.settings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voice: null,
      lang: 'en-US'
    };
  }

  // Add text to speech queue
  addToQueue(text, options = {}) {
    const utterance = {
      id: Date.now() + Math.random(),
      text,
      options: { ...this.settings, ...options },
      callbacks: options.callbacks || {}
    };

    this.speechQueue.push(utterance);
    this.processQueue();

    return utterance.id;
  }

  // Process speech queue
  async processQueue() {
    if (this.isProcessing || this.speechQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const utterance = this.speechQueue.shift();

    try {
      await this.speak(utterance);
    } catch (error) {
      console.error('Speech error:', error);
      utterance.callbacks.onError?.(error);
    }

    this.isProcessing = false;

    // Continue with next item in queue
    if (this.speechQueue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  // Speak individual utterance
  speak(utterance) {
    return new Promise((resolve, reject) => {
      const speechUtterance = new SpeechSynthesisUtterance(utterance.text);
      this.currentUtterance = speechUtterance;

      // Apply settings
      Object.assign(speechUtterance, utterance.options);

      // Event handlers
      speechUtterance.onstart = () => {
        utterance.callbacks.onStart?.();
      };

      speechUtterance.onend = () => {
        utterance.callbacks.onEnd?.();
        this.currentUtterance = null;
        resolve();
      };

      speechUtterance.onerror = (event) => {
        utterance.callbacks.onError?.(event.error);
        this.currentUtterance = null;
        reject(event.error);
      };

      // Start speaking
      window.speechSynthesis.speak(speechUtterance);
    });
  }

  // Pause current speech
  pause() {
    window.speechSynthesis.pause();
  }

  // Resume speech
  resume() {
    window.speechSynthesis.resume();
  }

  // Stop all speech and clear queue
  stop() {
    window.speechSynthesis.cancel();
    this.speechQueue = [];
    this.isProcessing = false;
    this.currentUtterance = null;
  }

  // Get current status
  getStatus() {
    return {
      isSpeaking: window.speechSynthesis.speaking,
      isPaused: window.speechSynthesis.paused,
      queueLength: this.speechQueue.length,
      currentText: this.currentUtterance?.text || null
    };
  }

  // Batch text processing with SSML support
  speakBatch(texts, options = {}) {
    const results = [];

    texts.forEach((text, index) => {
      const id = this.addToQueue(text, {
        ...options,
        callbacks: {
          onStart: () => options.onStart?.(index, text),
          onEnd: () => options.onEnd?.(index, text),
          onError: (error) => options.onError?.(index, text, error)
        }
      });

      results.push(id);
    });

    return results;
  }
}

export default AdvancedTTS;`,
          description: "Advanced TTS service with queue management and batch processing"
        }
      ]
    },
    {
      id: "elevenlabs",
      title: "ElevenLabs API Integration",
      content: `
# Professional TTS with ElevenLabs

ElevenLabs provides some of the most realistic AI voices available. Let's integrate their API for production-quality text-to-speech.

## Why ElevenLabs?

- **Ultra-realistic voices**: Almost indistinguishable from human speech
- **Voice cloning**: Create custom voices from samples
- **Emotion and intonation**: Natural speech patterns
- **Multiple languages**: 29+ languages supported
- **Fast generation**: Quick audio generation times
- **API-first**: Easy integration with existing applications

## Getting Started

1. **Sign up** at [ElevenLabs](https://elevenlabs.io/)
2. **Get API key** from the dashboard
3. **Explore voices** in the Voice Library
4. **Test the API** with their playground

## API Endpoints

- **Text-to-Speech**: \`https://api.elevenlabs.io/v1/text-to-speech/{voice_id}\`
- **Voices**: \`https://api.elevenlabs.io/v1/voices\`
- **User Info**: \`https://api.elevenlabs.io/v1/user\`

## Voice Models

- **Eleven Multilingual v2**: Best for non-English content
- **Eleven Monolingual v1**: Optimized for English
- **English v1**: High-quality English voices
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "ElevenLabs TTS Service",
          code: `// services/elevenlabs-tts.js
class ElevenLabsTTS {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.elevenlabs.io/v1';
    this.defaultVoice = 'rachel'; // Popular voice
    this.defaultModel = 'eleven_monolingual_v1';
  }

  // Get available voices
  async getVoices() {
    try {
      const response = await fetch(\`\${this.baseURL}/voices\`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  // Generate speech from text
  async generateSpeech(text, options = {}) {
    const {
      voiceId = this.defaultVoice,
      modelId = this.defaultModel,
      stability = 0.75,
      similarity_boost = 0.75,
      style = 0.0,
      use_speaker_boost = false,
      optimize_streaming_latency = 0
    } = options;

    try {
      const response = await fetch(
        \`https://api.elevenlabs.io/v1/text-to-speech/\${voiceId}\`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text: text,
            model_id: modelId,
            voice_settings: {
              stability,
              similarity_boost,
              style,
              use_speaker_boost
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(\`ElevenLabs API error: \${errorData.detail?.message || response.statusText}\`);
      }

      // Get audio blob
      const audioBlob = await response.blob();

      // Create audio URL
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioBlob,
        audioUrl,
        duration: await this.getAudioDuration(audioBlob)
      };
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  // Streaming speech generation
  async *generateSpeechStream(text, options = {}) {
    const {
      voiceId = this.defaultVoice,
      modelId = this.defaultModel,
      output_format = 'mp3_44100_128'
    } = options;

    const response = await fetch(
      \`https://api.elevenlabs.io/v1/text-to-speech/\${voiceId}/stream\`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          output_format
        })
      }
    );

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      yield value; // Raw audio chunk
    }
  }

  // Get audio duration from blob
  async getAudioDuration(audioBlob) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.src = URL.createObjectURL(audioBlob);
    });
  }

  // Download audio file
  downloadAudio(audioBlob, filename = 'speech.mp3') {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Get user subscription info
  async getUserInfo() {
    try {
      const response = await fetch(\`\${this.baseURL}/user\`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Clone voice (requires samples)
  async cloneVoice(name, description, files) {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(\`\${this.baseURL}/voices/add\`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cloning voice:', error);
      throw error;
    }
  }
}

export default ElevenLabsTTS;`,
          description: "Complete ElevenLabs TTS service implementation"
        },
        {
          language: "python",
          title: "Python ElevenLabs Integration",
          code: `# elevenlabs_tts.py
import requests
import asyncio
from typing import Optional, Dict, Any, AsyncGenerator
import io
from pydub import AudioSegment
import tempfile
import os

class ElevenLabsTTS:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.elevenlabs.io/v1"
        self.default_voice = "rachel"
        self.default_model = "eleven_monolingual_v1"

    def get_voices(self) -> Dict[str, Any]:
        """Get all available voices"""
        try:
            response = requests.get(
                f"{self.base_url}/voices",
                headers={
                    "xi-api-key": self.api_key,
                    "Content-Type": "application/json"
                }
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching voices: {e}")
            raise

    def generate_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
        model_id: Optional[str] = None,
        stability: float = 0.75,
        similarity_boost: float = 0.75,
        style: float = 0.0,
        use_speaker_boost: bool = False
    ) -> bytes:
        """Generate speech from text"""
        voice_id = voice_id or self.default_voice
        model_id = model_id or self.default_model

        try:
            response = requests.post(
                f"{self.base_url}/text-to-speech/{voice_id}",
                headers={
                    "xi-api-key": self.api_key,
                    "Content-Type": "application/json",
                    "Accept": "audio/mpeg"
                },
                json={
                    "text": text,
                    "model_id": model_id,
                    "voice_settings": {
                        "stability": stability,
                        "similarity_boost": similarity_boost,
                        "style": style,
                        "use_speaker_boost": use_speaker_boost
                    }
                }
            )
            response.raise_for_status()
            return response.content
        except requests.RequestException as e:
            print(f"Error generating speech: {e}")
            raise

    def save_audio(self, audio_data: bytes, filename: str) -> str:
        """Save audio data to file"""
        with open(filename, 'wb') as f:
            f.write(audio_data)
        return filename

    def generate_and_save(
        self,
        text: str,
        output_path: str,
        **kwargs
    ) -> str:
        """Generate speech and save to file"""
        audio_data = self.generate_speech(text, **kwargs)
        return self.save_audio(audio_data, output_path)

    async def stream_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
        model_id: Optional[str] = None
    ) -> AsyncGenerator[bytes, None]:
        """Stream speech generation"""
        voice_id = voice_id or self.default_voice
        model_id = model_id or self.default_model

        try:
            async with requests.AsyncClientSession() as session:
                async with session.post(
                    f"{self.base_url}/text-to-speech/{voice_id}/stream",
                    headers={
                        "xi-api-key": self.api_key,
                        "Content-Type": "application/json"
                    },
                    json={
                        "text": text,
                        "model_id": model_id,
                        "output_format": "mp3_44100_128"
                    }
                ) as response:
                    response.raise_for_status()

                    async for chunk in response.content.iter_chunked(1024):
                        yield chunk
        except requests.RequestException as e:
            print(f"Error streaming speech: {e}")
            raise

    def get_user_info(self) -> Dict[str, Any]:
        """Get user subscription and usage info"""
        try:
            response = requests.get(
                f"{self.base_URL}/user",
                headers={"xi-api-key": self.api_key}
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching user info: {e}")
            raise

    def batch_generate(
        self,
        texts: list[str],
        output_dir: str = "output",
        voice_id: Optional[str] = None,
        **kwargs
    ) -> list[str]:
        """Generate multiple speech files"""
        os.makedirs(output_dir, exist_ok=True)
        output_files = []

        for i, text in enumerate(texts):
            try:
                filename = os.path.join(output_dir, f"speech_{i:03d}.mp3")
                self.generate_and_save(text, filename, voice_id=voice_id, **kwargs)
                output_files.append(filename)
                print(f"Generated: {filename}")
            except Exception as e:
                print(f"Error processing text {i}: {e}")

        return output_files

# Usage example
if __name__ == "__main__":
    # Initialize with your API key
    tts = ElevenLabsTTS(api_key="your-api-key-here")

    # Generate speech
    text = "Hello, this is a test of the ElevenLabs text-to-speech system."
    audio_data = tts.generate_speech(text, voice_id="rachel")

    # Save to file
    output_file = tts.save_audio(audio_data, "output.mp3")
    print(f"Audio saved to: {output_file}")

    # Batch generation
    texts = [
        "First sentence to convert.",
        "Second sentence to convert.",
        "Third sentence to convert."
    ]
    output_files = tts.batch_generate(texts, voice_id="rachel")
    print(f"Generated {len(output_files)} files")`,
          description: "Python implementation with batch processing and streaming support"
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced TTS Features",
      content: `
# Advanced TTS Implementation

## 1. Voice Cloning

Create custom voices that sound like specific people:

### Requirements:
- Clean audio samples (30 seconds to 10 minutes)
- No background noise
- Consistent speaking style
- Good audio quality

### Process:
1. Upload voice samples
2. Wait for training (10-30 minutes)
3. Test and use the cloned voice

## 2. Emotion and Style Control

Modern TTS can express emotions:
- Happy, sad, angry, surprised
- Conversational vs formal
- News reporter style
- Audiobook narrator style

## 3. Real-time Applications

### Live Chat TTS:
- Low-latency streaming
- Queue management
- Interruption handling
- Voice switching

### Accessibility Features:
- Reading speed control
- Highlighted text sync
- Multiple language support

## 4. Performance Optimization

### Caching Strategies:
- Cache frequently used text
- Pre-generate common responses
- Use CDN for audio files

### Cost Management:
- Monitor API usage
- Implement rate limiting
- Choose appropriate voice models

## 5. Integration Patterns

### Frontend Integration:
- Progressive loading
- Fallback to browser TTS
- Offline capabilities

### Backend Integration:
- Audio processing pipelines
- Batch generation
- Quality control
      `,
      codeExamples: [
        {
          language: "javascript",
          title: "TTS with Emotion Control",
          code: `// services/emotional-tts.js
class EmotionalTTS extends ElevenLabsTTS {
  constructor(apiKey) {
    super(apiKey);
    this.emotionPresets = {
      happy: { style: 0.8, stability: 0.6, similarity_boost: 0.9 },
      sad: { style: -0.8, stability: 0.9, similarity_boost: 0.7 },
      angry: { style: 0.9, stability: 0.4, similarity_boost: 0.8 },
      surprised: { style: 0.7, stability: 0.5, similarity_boost: 0.85 },
      neutral: { style: 0.0, stability: 0.75, similarity_boost: 0.75 },
      excited: { style: 0.6, stability: 0.5, similarity_boost: 0.9 },
      calm: { style: -0.3, stability: 0.9, similarity_boost: 0.8 },
      professional: { style: -0.2, stability: 0.95, similarity_boost: 0.85 }
    };
  }

  async generateEmotionalSpeech(text, emotion = 'neutral', options = {}) {
    const preset = this.emotionPresets[emotion] || this.emotionPresets.neutral;

    return await this.generateSpeech(text, {
      ...preset,
      ...options
    });
  }

  // Analyze text for emotion keywords
  analyzeTextEmotion(text) {
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'wonderful', 'great', 'amazing', 'fantastic'],
      sad: ['sad', 'sorry', 'unfortunate', 'disappointed', 'tragic'],
      angry: ['angry', 'mad', 'furious', 'outraged', 'unacceptable'],
      surprised: ['surprised', 'shocked', 'wow', 'amazing', 'incredible']
    };

    const lowerText = text.toLowerCase();
    let detectedEmotion = 'neutral';
    let maxScore = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (lowerText.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    }

    return detectedEmotion;
  }

  // Auto-generate speech with detected emotion
  async generateSmartSpeech(text, options = {}) {
    const detectedEmotion = this.analyzeTextEmotion(text);
    return await this.generateEmotionalSpeech(text, detectedEmotion, options);
  }

  // Dialog system with multiple speakers
  async generateDialog(dialog, speakerVoices) {
    const results = [];

    for (const line of dialog) {
      const { speaker, text, emotion } = line;
      const voiceId = speakerVoices[speaker];

      if (!voiceId) {
        console.warn(\`No voice found for speaker: \${speaker}\`);
        continue;
      }

      try {
        const result = await this.generateEmotionalSpeech(
          text,
          emotion,
          { voiceId }
        );

        results.push({
          speaker,
          emotion,
          text,
          audio: result
        });
      } catch (error) {
        console.error(\`Error generating dialog for \${speaker}:\`, error);
      }
    }

    return results;
  }
}

export default EmotionalTTS;`,
          description: "TTS service with emotion detection and control"
        },
        {
          language: "react",
          title: "Advanced TTS React Component",
          code: `// components/AdvancedTTSSpeaker.js
import React, { useState, useRef, useEffect } from 'react';
import EmotionalTTS from '../services/emotional-tts';

const AdvancedTTSSpeaker = ({ apiKey, texts = [] }) => {
  const [tts] = useState(() => new EmotionalTTS(apiKey));
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [emotion, setEmotion] = useState('neutral');
  const [audioQueue, setAudioQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [generating, setGenerating] = useState(false);

  const audioRef = useRef(null);
  const queueRef = useRef([]);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const voicesData = await tts.getVoices();
      setVoices(voicesData.voices);

      // Set default voice
      if (voicesData.voices.length > 0) {
        setSelectedVoice(voicesData.voices[0].voice_id);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  const generateSpeech = async (text, selectedEmotion = null) => {
    setGenerating(true);
    try {
      const result = await tts.generateEmotionalSpeech(
        text,
        selectedEmotion || emotion,
        { voiceId: selectedVoice }
      );

      const audioItem = {
        id: Date.now(),
        text,
        emotion: selectedEmotion || emotion,
        audioUrl: result.audioUrl,
        audioBlob: result.audioBlob
      };

      setAudioQueue(prev => [...prev, audioItem]);
      queueRef.current = [...queueRef.current, audioItem];
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Failed to generate speech. Please check your API key.');
    } finally {
      setGenerating(false);
    }
  };

  const playAudio = (audioItem) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioItem.audioUrl);
    audioRef.current = audio;
    setCurrentAudio(audioItem);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      playNextInQueue();
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      playNextInQueue();
    };

    audio.play();
  };

  const playNextInQueue = () => {
    const remaining = queueRef.current.filter(
      item => item.id !== currentAudio?.id
    );

    if (remaining.length > 0) {
      const next = remaining[0];
      queueRef.current = remaining;
      playAudio(next);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentAudio(null);
  };

  const downloadAudio = (audioItem) => {
    tts.downloadAudio(audioItem.audioBlob, \`\${audioItem.text.substring(0, 20)}.mp3\`);
  };

  const clearQueue = () => {
    stopPlayback();
    setAudioQueue([]);
    queueRef.current = [];
  };

  const generateAllTexts = async () => {
    for (const text of texts) {
      await generateSpeech(text);
      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const playQueue = () => {
    if (queueRef.current.length > 0 && !isPlaying) {
      playAudio(queueRef.current[0]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Voice:</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.voice_id} value={voice.voice_id}>
                  {voice.name} ({voice.labels?.accent || 'Unknown'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Emotion:</label>
          <Select value={emotion} onValueChange={setEmotion}>
            <SelectTrigger>
              <SelectValue placeholder="Select emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="happy">Happy</SelectItem>
              <SelectItem value="sad">Sad</SelectItem>
              <SelectItem value="angry">Angry</SelectItem>
              <SelectItem value="surprised">Surprised</SelectItem>
              <SelectItem value="calm">Calm</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end space-x-2">
          <Button
            onClick={generateAllTexts}
            disabled={generating || texts.length === 0}
            className="flex-1"
          >
            {generating ? 'Generating...' : 'Generate All'}
          </Button>
        </div>
      </div>

      {/* Audio Queue */}
      {audioQueue.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Audio Queue ({audioQueue.length})</h3>
            <div className="space-x-2">
              <Button onClick={playQueue} disabled={isPlaying} variant="outline" size="sm">
                <Play className="w-4 h-4 mr-1" />
                Play All
              </Button>
              <Button onClick={stopPlayback} disabled={!isPlaying} variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-1" />
                Stop
              </Button>
              <Button onClick={clearQueue} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {audioQueue.map((audioItem) => (
              <div
                key={audioItem.id}
                className={\`p-3 border rounded-lg flex items-center justify-between \${
                  currentAudio?.id === audioItem.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }\`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {audioItem.emotion}
                    </Badge>
                    <span className="text-sm text-gray-600 truncate">
                      {audioItem.text}
                    </span>
                  </div>
                  {currentAudio?.id === audioItem.id && (
                    <div className="text-xs text-blue-600">Now playing...</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => playAudio(audioItem)}
                    disabled={isPlaying && currentAudio?.id === audioItem.id}
                    variant="outline"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadAudio(audioItem)}
                    variant="outline"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedTTSSpeaker;`,
          description: "Complete React component with emotion control and audio queue management"
        }
      ]
    }
  ]
};

export default function TTSTutorial() {
  const [activeSection, setActiveSection] = useState('basics');
  const [copiedCode, setCopiedCode] = useState('');
  const [progress, setProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [demoText, setDemoText] = useState('Hello! This is a test of the text-to-speech system.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsAudio, setTtsAudio] = useState(null);

  const copyToClipboard = async (text, codeId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const markSectionComplete = (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      setProgress((completedSections.length + 1) / TTS_TUTORIAL_CONTENT.sections.length * 100);
    }
  };

  const currentSection = TTS_TUTORIAL_CONTENT.sections.find(s => s.id === activeSection);

  // Browser TTS Demo
  const speakWithBrowser = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(demoText);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/learn/ai-integration">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tutorials
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {TTS_TUTORIAL_CONTENT.introduction.title}
                </h1>
                <p className="text-gray-600">
                  {TTS_TUTORIAL_CONTENT.introduction.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <Mic className="w-4 h-4 mr-1" />
                {TTS_TUTORIAL_CONTENT.introduction.duration}
              </Badge>
              <Badge variant="outline">
                <Code className="w-4 h-4 mr-1" />
                {TTS_TUTORIAL_CONTENT.introduction.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Tutorial Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TTS_TUTORIAL_CONTENT.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      {completedSections.includes(section.id) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}

                {/* Progress Bar */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Demo */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Headphones className="w-5 h-5 mr-2" />
                  Quick Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  placeholder="Enter text to convert to speech..."
                  className="min-h-[80px]"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={speakWithBrowser}
                    disabled={isSpeaking}
                    className="flex-1"
                  >
                    {isSpeaking ? (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Speaking...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Speak
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={stopSpeaking}
                    disabled={!isSpeaking}
                    variant="outline"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentSection && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{currentSection.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {/* Render markdown content */}
                    <div dangerouslySetInnerHTML={{
                      __html: currentSection.content
                        .replace(/# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
                        .replace(/## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
                        .replace(/### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 mt-3">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
                        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                          return `<div class="my-4"><div class="bg-gray-100 p-3 rounded-lg"><pre><code class="text-sm">${code.trim()}</code></pre></div></div>`;
                        })
                        .replace(/^\d+\.\s/gm, '<li class="ml-4">')
                        .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
                        .replace(/\n/g, '<br>')
                    }} />
                  </div>

                  {/* Code Examples */}
                  {currentSection.codeExamples && currentSection.codeExamples.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Code className="w-5 h-5 mr-2" />
                        Code Examples
                      </h3>
                      <div className="space-y-6">
                        {currentSection.codeExamples.map((example, idx) => (
                          <div key={idx} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{example.title}</h4>
                                <p className="text-sm text-gray-600">{example.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {example.language}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(example.code, `code-${idx}`)}
                                >
                                  {copiedCode === `code-${idx}` ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="bg-gray-900 p-4">
                              <SyntaxHighlighter
                                language={example.language}
                                style={tomorrow}
                                customStyle={{
                                  background: 'transparent',
                                  margin: 0,
                                  fontSize: '14px'
                                }}
                              >
                                {example.code}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section Actions */}
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => markSectionComplete(currentSection.id)}
                        disabled={completedSections.includes(currentSection.id)}
                      >
                        {completedSections.includes(currentSection.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                      {currentSection.codeExamples && currentSection.codeExamples.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const allCode = currentSection.codeExamples.map(e => e.code).join('\n\n');
                            copyToClipboard(allCode, 'all-code');
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Copy All Code
                        </Button>
                      )}
                    </div>

                    {progress === 100 && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Tutorial Complete!</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Objectives */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {TTS_TUTORIAL_CONTENT.introduction.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}