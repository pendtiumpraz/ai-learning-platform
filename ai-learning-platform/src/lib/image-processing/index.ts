/**
 * Image Processing Utilities for VLM
 * Handles image upload, processing, optimization, and analysis
 */

export interface ImageConfig {
  maxWidth: number
  maxHeight: number
  quality: number
  format: 'jpeg' | 'png' | 'webp'
  enableCompression: boolean
}

export interface ImageMetadata {
  name: string
  size: number
  width: number
  height: number
  format: string
  colorSpace: string
  hasAlpha: boolean
  aspectRatio: number
}

export interface AnalysisRequest {
  image: File | string
  prompt: string
  model: string
  maxTokens?: number
  temperature?: number
  detail?: 'low' | 'medium' | 'high'
}

export interface DetectionResult {
  objects: DetectedObject[]
  text?: TextRegion[]
  faces?: FaceDetection[]
  colors?: ColorInfo[]
}

export interface DetectedObject {
  name: string
  confidence: number
  bbox: BoundingBox
  attributes?: Record<string, any>
}

export interface TextRegion {
  text: string
  confidence: number
  bbox: BoundingBox
  language?: string
}

export interface FaceDetection {
  bbox: BoundingBox
  confidence: number
  age?: number
  gender?: string
  emotion?: string
  landmarks?: Point[]
}

export interface ColorInfo {
  color: string
  hex: string
  percentage: number
  name: string
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

/**
 * Default configurations for different use cases
 */
export const IMAGE_CONFIGS: Record<string, ImageConfig> = {
  // High quality for analysis
  analysis: {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.95,
    format: 'jpeg',
    enableCompression: false
  },

  // Optimized for web
  web: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.8,
    format: 'webp',
    enableCompression: true
  },

  // Thumbnail generation
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.7,
    format: 'jpeg',
    enableCompression: true
  },

  // Mobile optimized
  mobile: {
    maxWidth: 640,
    maxHeight: 640,
    quality: 0.75,
    format: 'webp',
    enableCompression: true
  }
}

/**
 * Supported image formats
 */
export const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff'
]

/**
 * Maximum file sizes for different use cases (in bytes)
 */
export const MAX_FILE_SIZES = {
  upload: 20 * 1024 * 1024, // 20MB
  analysis: 10 * 1024 * 1024, // 10MB
  thumbnail: 2 * 1024 * 1024, // 2MB
  avatar: 1 * 1024 * 1024 // 1MB
}

/**
 * Main Image Processor class
 */
export class ImageProcessor {
  private config: ImageConfig

  constructor(config: ImageConfig = IMAGE_CONFIGS.analysis) {
    this.config = config
  }

  /**
   * Validate uploaded image
   */
  validateImage(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      errors.push(`Unsupported format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`)
    }

    if (file.size > MAX_FILE_SIZES.upload) {
      errors.push(`File too large. Maximum size: ${MAX_FILE_SIZES.upload / 1024 / 1024}MB`)
    }

    if (file.size === 0) {
      errors.push('File is empty')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Extract metadata from image file
   */
  async extractMetadata(file: File): Promise<ImageMetadata> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Cannot get canvas context'))
        return
      }

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, 1, 1)
        const hasAlpha = imageData.data.length === 4

        resolve({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          format: file.type,
          colorSpace: 'sRGB', // Simplified - in real implementation would detect actual color space
          hasAlpha,
          aspectRatio: img.width / img.height
        })
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Process and optimize image
   */
  async processImage(
    file: File,
    targetConfig?: Partial<ImageConfig>
  ): Promise<{ blob: Blob; metadata: ImageMetadata }> {
    const config = { ...this.config, ...targetConfig }
    const metadata = await this.extractMetadata(file)

    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Cannot get canvas context'))
        return
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          config.maxWidth,
          config.maxHeight
        )

        canvas.width = width
        canvas.height = height

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                metadata: {
                  ...metadata,
                  width,
                  height,
                  size: blob.size
                }
              })
            } else {
              reject(new Error('Failed to process image'))
            }
          },
          `image/${config.format}`,
          config.quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(
    file: File,
    size: number = 300
  ): Promise<Blob> {
    const thumbnailConfig: ImageConfig = {
      maxWidth: size,
      maxHeight: size,
      quality: 0.8,
      format: 'jpeg',
      enableCompression: true
    }

    const result = await this.processImage(file, thumbnailConfig)
    return result.blob
  }

  /**
   * Create placeholder image
   */
  createPlaceholder(
    width: number,
    height: number,
    text: string = 'No Image',
    backgroundColor: string = '#f3f4f6',
    textColor: string = '#6b7280'
  ): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return ''

    canvas.width = width
    canvas.height = height

    // Fill background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Draw text
    ctx.fillStyle = textColor
    ctx.font = `${Math.min(width, height) / 10}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2)

    return canvas.toDataURL('image/png')
  }

  /**
   * Generate dominant colors from image
   */
  async extractColors(imageFile: File, numColors: number = 5): Promise<ColorInfo[]> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Cannot get canvas context'))
        return
      }

      img.onload = () => {
        // Resize for faster processing
        const maxSize = 100
        let { width, height } = this.calculateDimensions(img.width, img.height, maxSize, maxSize)

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        const imageData = ctx.getImageData(0, 0, width, height)
        const pixels = imageData.data

        // Simple color extraction (in real implementation, use k-means clustering)
        const colorMap: Record<string, number> = {}

        for (let i = 0; i < pixels.length; i += 4) {
          const r = Math.floor(pixels[i] / 16) * 16
          const g = Math.floor(pixels[i + 1] / 16) * 16
          const b = Math.floor(pixels[i + 2] / 16) * 16
          const rgb = `${r},${g},${b}`

          colorMap[rgb] = (colorMap[rgb] || 0) + 1
        }

        // Sort by frequency and get top colors
        const sortedColors = Object.entries(colorMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, numColors)

        const totalPixels = pixels.length / 4
        const colors: ColorInfo[] = sortedColors.map(([rgb, count]) => {
          const [r, g, b] = rgb.split(',').map(Number)
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

          return {
            color: rgb,
            hex,
            percentage: (count / totalPixels) * 100,
            name: this.getColorName(r, g, b)
          }
        })

        resolve(colors)
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(imageFile)
    })
  }

  /**
   * Convert image to base64
   */
  async toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Convert base64 to blob
   */
  base64ToBlob(base64: string, type: string = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type })
  }

  /**
   * Estimate processing time
   */
  estimateProcessingTime(fileSize: number, config: ImageConfig): number {
    // Base processing time in milliseconds
    const baseTime = 100
    const sizeTime = (fileSize / 1024 / 1024) * 50 // 50ms per MB
    const compressionMultiplier = config.enableCompression ? 1.5 : 1.0

    return Math.ceil((baseTime + sizeTime) * compressionMultiplier)
  }

  /**
   * Private: Calculate new dimensions maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight }

    if (width > maxWidth) {
      height = (maxWidth / width) * height
      width = maxWidth
    }

    if (height > maxHeight) {
      width = (maxHeight / height) * width
      height = maxHeight
    }

    return { width: Math.round(width), height: Math.round(height) }
  }

  /**
   * Private: Get color name from RGB values
   */
  private getColorName(r: number, g: number, b: number): string {
    // Simplified color naming - in real implementation, use a more sophisticated algorithm
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    if (diff < 30) {
      const gray = (r + g + b) / 3
      if (gray < 50) return 'Black'
      if (gray < 200) return 'Gray'
      return 'White'
    }

    if (r > g && r > b) {
      if (g > b) return 'Orange'
      return 'Red'
    }
    if (g > r && g > b) {
      if (r > b) return 'Yellow'
      return 'Green'
    }
    if (b > r && b > g) {
      if (r > g) return 'Purple'
      return 'Blue'
    }

    return 'Mixed'
  }
}

/**
 * Utility functions for image processing
 */
export const ImageUtils = {
  /**
   * Validate image URL
   */
  isValidImageUrl(url: string): boolean {
    try {
      new URL(url)
      return /\.(jpg|jpeg|png|gif|webp|bmp|tiff)(\?.*)?$/i.test(url)
    } catch {
      return false
    }
  },

  /**
   * Get image format from MIME type
   */
  getFormatFromMimeType(mimeType: string): string {
    return mimeType.split('/')[1]?.toLowerCase() || 'unknown'
  },

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Generate unique filename
   */
  generateFilename(originalName: string, suffix?: string): string {
    const extension = originalName.split('.').pop()
    const baseName = originalName.split('.').slice(0, -1).join('.')
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)

    return `${baseName}${suffix ? `-${suffix}` : ''}-${timestamp}-${random}.${extension}`
  },

  /**
   * Check if image needs optimization
   */
  needsOptimization(metadata: ImageMetadata, targetConfig: ImageConfig): boolean {
    return (
      metadata.width > targetConfig.maxWidth ||
      metadata.height > targetConfig.maxHeight ||
      metadata.size > 1024 * 1024 // 1MB
    )
  },

  /**
   * Calculate compression ratio
   */
  calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    if (originalSize === 0) return 0
    return Math.round(((originalSize - compressedSize) / originalSize) * 100)
  },

  /**
   * Create image preview data URL
   */
  async createPreview(file: File, maxSize: number = 200): Promise<string> {
    const processor = new ImageProcessor()
    const thumbnail = await processor.generateThumbnail(file, maxSize)
    return URL.createObjectURL(thumbnail)
  }
}

export default ImageProcessor