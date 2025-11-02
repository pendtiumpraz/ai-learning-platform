'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, Play, Pause, Download, Upload, Volume2, Settings, Copy, RefreshCw } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  provider: string;
}

interface AudioSettings {
  rate: number;
  pitch: number;
  volume: number;
  format: string;
  quality: string;
}

export default function TTSPlaygroundPage() {
  const [text, setText] = useState('Welcome to the Text-to-Speech Playground. Try typing any text and hear it come to life with different voices and settings.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('default-en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [voices] = useState<Voice[]>([
    { id: 'default-en', name: 'Default English', language: 'English', gender: 'neutral', provider: 'Browser' },
    { id: 'female-en', name: 'Emma', language: 'English', gender: 'female', provider: 'Neural' },
    { id: 'male-en', name: 'James', language: 'English', gender: 'male', provider: 'Neural' },
    { id: 'female-es', name: 'Sofia', language: 'Spanish', gender: 'female', provider: 'Neural' },
    { id: 'male-fr', name: 'Pierre', language: 'French', gender: 'male', provider: 'Neural' },
    { id: 'female-de', name: 'Anna', language: 'German', gender: 'female', provider: 'Neural' },
    { id: 'neutral-zh', name: 'Lin', language: 'Chinese', gender: 'neutral', provider: 'Neural' },
    { id: 'female-ja', name: 'Yuki', language: 'Japanese', gender: 'female', provider: 'Neural' }
  ]);

  const [settings, setSettings] = useState<AudioSettings>({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    format: 'mp3',
    quality: 'high'
  });

  const [presets] = useState([
    { name: 'Storyteller', rate: 0.9, pitch: 1.0, voice: 'female-en' },
    { name: 'News Anchor', rate: 1.1, pitch: 1.0, voice: 'male-en' },
    { name: 'Friendly Assistant', rate: 1.0, pitch: 1.1, voice: 'female-en' },
    { name: 'Professional', rate: 1.0, pitch: 0.9, voice: 'male-en' }
  ]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        }
      };
    }
  }, []);

  const handleGenerateSpeech = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate API call - in real app, this would call TTS API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate generated audio URL
      const mockAudioUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      setAudioUrl(mockAudioUrl);

      // Add to history
      setHistory(prev => [text, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts-audio-${Date.now()}.${settings.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const applyPreset = (preset: any) => {
    setSettings(prev => ({
      ...prev,
      rate: preset.rate,
      pitch: preset.pitch
    }));
    setSelectedVoice(preset.voice);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const getVoiceColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/tts"
              className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to TTS
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">TTS Playground</h1>
          <p className="text-cyan-100">Experiment with text-to-speech using different voices and settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Text</h2>
              <div className="space-y-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to convert to speech..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Text File
                      <input
                        type="file"
                        accept=".txt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => setText('')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {text.length} characters
                  </div>
                </div>
              </div>
            </div>

            {/* Voice Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Selection</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedVoice === voice.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{voice.name}</h3>
                        <p className="text-sm text-gray-600">{voice.language}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVoiceColor(voice.gender)}`}>
                        {voice.gender}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{voice.provider}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Audio Output</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerateSpeech}
                    disabled={isGenerating || !text.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    {isGenerating ? 'Generating...' : 'Generate Speech'}
                  </button>
                  {audioUrl && (
                    <>
                      <button
                        onClick={handlePlayPause}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </>
                  )}
                </div>
                {audioUrl && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <audio ref={audioRef} src={audioUrl} className="w-full" controls />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Voice Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Voice Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed: {settings.rate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.rate}
                    onChange={(e) => setSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pitch: {settings.pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.pitch}
                    onChange={(e) => setSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume: {Math.round(settings.volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.1"
                    value={settings.volume}
                    onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h2>
              <div className="space-y-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{preset.name}</div>
                    <div className="text-sm text-gray-600">
                      Speed: {preset.rate}x | Pitch: {preset.pitch}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent History</h2>
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setText(item)}
                      className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="text-sm text-gray-900 line-clamp-2">{item}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Copy className="w-3 h-3" />
                        Click to use
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recent speech generation</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}