'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Image, Upload, Eye, Brain, Camera, Download, Copy, ZoomIn, MessageSquare, Settings, Palette } from 'lucide-react';

interface ImageData {
  url: string;
  name: string;
  size: string;
  analysis?: string;
}

interface VLMTask {
  id: string;
  name: string;
  description: string;
  icon: any;
  prompt: string;
}

export default function VLMPlaygroundPage() {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [selectedTask, setSelectedTask] = useState('describe');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<Array<{
    image: string;
    prompt: string;
    result: string;
    timestamp: Date;
  }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tasks] = useState<VLMTask[]>([
    {
      id: 'describe',
      name: 'Describe Image',
      description: 'Generate detailed description of the image',
      icon: MessageSquare,
      prompt: 'Describe this image in detail, including objects, colors, composition, and any notable features.'
    },
    {
      id: 'ocr',
      name: 'Extract Text',
      description: 'Read and extract text from the image',
      icon: Copy,
      prompt: 'Extract all readable text from this image and organize it logically.'
    },
    {
      id: 'analyze',
      name: 'Analyze Content',
      description: 'Deep analysis of image content and context',
      icon: Brain,
      prompt: 'Analyze this image comprehensively. What is happening? Who or what are the main subjects? What is the context or setting?'
    },
    {
      id: 'colors',
      name: 'Color Palette',
      description: 'Extract and analyze color scheme',
      icon: Palette,
      prompt: 'Analyze the color palette of this image. Identify the main colors, their proportions, and the overall mood they create.'
    }
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setSelectedImage({
          url,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Simulate VLM API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      const currentTask = tasks.find(t => t.id === selectedTask);
      const prompt = customPrompt || currentTask?.prompt || 'Describe this image';

      let result = '';
      switch (selectedTask) {
        case 'describe':
          result = `This image shows a modern workspace with clean aesthetics. The composition features a minimalist desk setup with a laptop, smartphone, and a cup of what appears to be coffee. The lighting is soft and natural, coming from what seems to be a window on the left side. The color palette consists of neutral tones - whites, grays, and blacks - with warm accents from the wooden desk surface. The overall mood is professional yet comfortable, suggesting a productive home office environment. The image appears to be taken from a slightly elevated angle, giving a clear view of the entire workspace setup.`;
          break;
        case 'ocr':
          result = `No visible text detected in this image. The image appears to show a workspace setup without any readable text elements, documents, or screens with visible content.`;
          break;
        case 'analyze':
          result = `This image captures a contemporary remote work setup that reflects modern work culture. The subject is a home office space characterized by:

**Environment**: Indoor setting with natural lighting, suggesting daytime conditions. The space appears organized and functional.

**Technology**: Presence of modern devices including a laptop and smartphone, indicating digital work activities.

**Aesthetics**: Minimalist design approach with clean lines and uncluttered surfaces. The wooden desk adds warmth to the otherwise neutral color scheme.

**Implications**: This setup suggests a professional who values both functionality and aesthetics in their work environment. It represents the growing trend of remote work and the importance of creating dedicated, inspiring workspaces at home.

**Context**: The image appears to be staged or curated, possibly for professional purposes like a blog post, social media, or work-from-home related content.`;
          break;
        case 'colors':
          result = `**Primary Color Palette:**
- White/Off-white: ~40% (walls, desk surface)
- Gray: ~25% (laptop, devices)
- Wood tones: ~20% (desk)
- Black: ~10% (phone frame, shadows)
- Accent colors: ~5% (coffee, decorative elements)

**Color Harmony:** The image uses a monochromatic scheme with warm wood accents, creating a calming and professional atmosphere. The neutral palette promotes focus and productivity while maintaining visual comfort.

**Psychological Impact:** The color choices convey professionalism, cleanliness, and sophistication. The warm wood tones prevent the space from feeling too sterile, adding a touch of personality and comfort.`;
          break;
        default:
          result = 'Analysis completed successfully.';
      }

      setAnalysisResult(result);

      // Add to history
      setAnalysisHistory(prev => [{
        image: selectedImage.url,
        prompt,
        result,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisResult('Error: Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(analysisResult);
  };

  const handleDownloadResult = () => {
    const element = document.createElement('a');
    const file = new Blob([analysisResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `vlm-analysis-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/learn/vlm"
              className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to VLM
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">VLM Playground</h1>
          <p className="text-indigo-100">Experiment with Vision Language Models on your images</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Image Input</h2>
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage.url}
                      alt="Selected"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{selectedImage.name}</span>
                    <span>{selectedImage.size}</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload an Image</h3>
                  <p className="text-gray-600 mb-4">Drag and drop or click to select</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </button>
                </div>
              )}
            </div>

            {/* Task Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Task</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tasks.map((task) => {
                  const IconComponent = task.icon;
                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTask === task.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-5 h-5 text-indigo-600 mt-1" />
                        <div>
                          <h3 className="font-medium text-gray-900">{task.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Prompt (Optional)</h2>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom prompt for the VLM..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>

            {/* Analysis Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-medium"
              >
                <Eye className="w-5 h-5" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
              </button>
            </div>

            {/* Results */}
            {analysisResult && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Analysis Result</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyResult}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Copy result"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownloadResult}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Download result"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{analysisResult}</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Model Info</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium">VLM-Base-v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Image Size</span>
                  <span className="font-medium">2048x2048</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supported Formats</span>
                  <span className="font-medium">JPG, PNG, WebP</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Tips</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use high-quality images for better results</li>
                <li>• Be specific in your custom prompts</li>
                <li>• Try different tasks to explore capabilities</li>
                <li>• Check analysis history for reference</li>
              </ul>
            </div>

            {/* History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h2>
              {analysisHistory.length > 0 ? (
                <div className="space-y-3">
                  {analysisHistory.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedImage({ url: item.image, name: 'Historical Image', size: 'Unknown' });
                        setAnalysisResult(item.result);
                        setCustomPrompt(item.prompt);
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Image className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {item.prompt.substring(0, 30)}...
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No analysis history yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}