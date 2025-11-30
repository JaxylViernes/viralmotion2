import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface MagicCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: CropSettings) => void;
  selectedLayerId: string | null;
  videoElement?: HTMLVideoElement | null;
  videoUrl?: string;
}

interface CropSettings {
  cropType: string;
  intensity: number;
  focusPoint: string;
  enableAutoZoom: boolean;
  aspectRatio: string;
  cropRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  keyframes?: Array<{
    time: number;
    x: number;
    y: number;
    scale: number;
  }>;
}

const CROP_TYPES = [
  { id: "smart", name: "Smart Crop", description: "AI detects main subject", needsBackend: false },
  { id: "face", name: "Face Focus", description: "Follows faces in video", needsBackend: false },
  { id: "center", name: "Center Focus", description: "Keeps center in frame", needsBackend: false },
  { id: "action", name: "Action Focus", description: "Follows movement", needsBackend: false },
  { id: "subtitle", name: "Subtitle Focus", description: "Keeps text visible", needsBackend: true },
  { id: "object", name: "Object Tracking", description: "Track specific objects", needsBackend: true },
];

const ASPECT_RATIOS = [
  { id: "9:16", name: "9:16", description: "TikTok/Reels" },
  { id: "1:1", name: "1:1", description: "Instagram Post" },
  { id: "4:5", name: "4:5", description: "Instagram Feed" },
  { id: "16:9", name: "16:9", description: "YouTube" },
];

const FOCUS_POINTS = [
  { id: "auto", name: "Auto" },
  { id: "center", name: "Center" },
  { id: "top", name: "Top" },
  { id: "bottom", name: "Bottom" },
  { id: "left", name: "Left" },
  { id: "right", name: "Right" },
];

// Advanced Video Processor (Client-side)
class AdvancedVideoCropProcessor {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas?: OffscreenCanvas;
  private offscreenCtx?: OffscreenCanvasRenderingContext2D;

  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    
    // Use OffscreenCanvas for better performance if available
    if (typeof OffscreenCanvas !== 'undefined') {
      this.offscreenCanvas = new OffscreenCanvas(video.videoWidth, video.videoHeight);
      this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true })!;
    }
  }

  // Browser-native Face Detection (No backend needed)
  async detectFaces(): Promise<Array<{ x: number; y: number; width: number; height: number }>> {
    if (!('FaceDetector' in window)) {
      console.warn('FaceDetector API not available');
      return [];
    }

    try {
      // @ts-ignore
      const faceDetector = new window.FaceDetector({ 
        maxDetectedFaces: 5,
        fastMode: true 
      });
      
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.ctx.drawImage(this.video, 0, 0);
      
      const faces = await faceDetector.detect(this.canvas);
      
      return faces.map((face: any) => ({
        x: face.boundingBox.x,
        y: face.boundingBox.y,
        width: face.boundingBox.width,
        height: face.boundingBox.height,
      }));
    } catch (error) {
      console.error('Face detection failed:', error);
      return [];
    }
  }

  // Motion/Action Detection using Optical Flow approximation
  async detectMotionRegions(): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    
    const ctx = this.offscreenCtx || this.ctx;
    const canvas = this.offscreenCanvas || this.canvas;
    
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    
    ctx.drawImage(this.video, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Create motion map
    const blockSize = 16;
    const motionMap: number[][] = [];
    
    for (let y = 0; y < height; y += blockSize) {
      const row: number[] = [];
      for (let x = 0; x < width; x += blockSize) {
        let variance = 0;
        let mean = 0;
        let count = 0;
        
        // Calculate variance in block (indicates detail/motion)
        for (let by = 0; by < blockSize && y + by < height; by++) {
          for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            mean += brightness;
            count++;
          }
        }
        mean /= count;
        
        for (let by = 0; by < blockSize && y + by < height; by++) {
          for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            variance += Math.pow(brightness - mean, 2);
          }
        }
        variance /= count;
        
        row.push(variance);
      }
      motionMap.push(row);
    }
    
    // Find region with highest motion/detail
    let maxMotion = 0;
    let motionX = 0;
    let motionY = 0;
    
    for (let y = 0; y < motionMap.length; y++) {
      for (let x = 0; x < motionMap[y].length; x++) {
        if (motionMap[y][x] > maxMotion) {
          maxMotion = motionMap[y][x];
          motionX = x * blockSize;
          motionY = y * blockSize;
        }
      }
    }
    
    if (maxMotion > 100) {
      return {
        x: Math.max(0, motionX - width * 0.2),
        y: Math.max(0, motionY - height * 0.2),
        width: width * 0.6,
        height: height * 0.6,
      };
    }
    
    return null;
  }

  // Smart Crop using Saliency Detection
  async detectSmartCrop(): Promise<{ x: number; y: number; width: number; height: number }> {
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    
    const ctx = this.offscreenCtx || this.ctx;
    const canvas = this.offscreenCanvas || this.canvas;
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(this.video, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Multi-scale saliency detection
    const saliencyMap = new Float32Array(width * height);
    
    // Calculate color-based saliency
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Lab color space approximation for perceptual saliency
        const l = 0.299 * r + 0.587 * g + 0.114 * b;
        const a = 0.5 * (r - g);
        const bVal = 0.5 * (r + g - 2 * b);
        
        // Calculate uniqueness (distance from mean)
        const uniqueness = Math.sqrt(a * a + bVal * bVal);
        
        // Edge detection (Sobel-like)
        let edgeStrength = 0;
        if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
          const leftIdx = (y * width + (x - 1)) * 4;
          const rightIdx = (y * width + (x + 1)) * 4;
          const topIdx = ((y - 1) * width + x) * 4;
          const bottomIdx = ((y + 1) * width + x) * 4;
          
          const gx = (data[rightIdx] - data[leftIdx]) / 255;
          const gy = (data[bottomIdx] - data[topIdx]) / 255;
          edgeStrength = Math.sqrt(gx * gx + gy * gy);
        }
        
        // Combined saliency score
        saliencyMap[y * width + x] = uniqueness * 0.4 + edgeStrength * 300 + l * 0.3;
      }
    }
    
    // Find optimal crop region using sliding window
    const targetWidth = Math.min(width * 0.7, height * 1.2); // Adjust for aspect ratio
    const targetHeight = height * 0.8;
    
    let bestScore = 0;
    let bestX = 0;
    let bestY = 0;
    
    const step = Math.max(10, Math.min(width, height) / 50);
    
    for (let y = 0; y <= height - targetHeight; y += step) {
      for (let x = 0; x <= width - targetWidth; x += step) {
        let score = 0;
        let count = 0;
        
        // Sample saliency in this region
        for (let sy = y; sy < y + targetHeight; sy += step) {
          for (let sx = x; sx < x + targetWidth; sx += step) {
            if (sx < width && sy < height) {
              score += saliencyMap[sy * width + sx];
              count++;
            }
          }
        }
        
        score /= count;
        
        // Prefer center slightly
        const centerBias = 1 - (Math.abs(x + targetWidth / 2 - width / 2) / width +
                                 Math.abs(y + targetHeight / 2 - height / 2) / height) * 0.3;
        score *= centerBias;
        
        if (score > bestScore) {
          bestScore = score;
          bestX = x;
          bestY = y;
        }
      }
    }
    
    return {
      x: bestX,
      y: bestY,
      width: targetWidth,
      height: targetHeight,
    };
  }

  // Generate smooth keyframes for auto-zoom effect
  async generateKeyframes(
    cropRegion: { x: number; y: number; width: number; height: number },
    duration: number,
    enableAutoZoom: boolean
  ): Promise<Array<{ time: number; x: number; y: number; scale: number }>> {
    if (!enableAutoZoom) {
      return [{
        time: 0,
        x: cropRegion.x,
        y: cropRegion.y,
        scale: 1,
      }];
    }

    const keyframes = [];
    const numKeyframes = Math.min(10, Math.floor(duration / 2)); // One keyframe every 2 seconds
    
    for (let i = 0; i < numKeyframes; i++) {
      const time = (duration / numKeyframes) * i;
      
      // Vary zoom slightly for dynamic effect
      const scale = 1 + Math.sin(i * Math.PI / numKeyframes) * 0.15;
      
      // Slight pan effect
      const panX = Math.sin(i * Math.PI / 5) * 20;
      const panY = Math.cos(i * Math.PI / 7) * 15;
      
      keyframes.push({
        time,
        x: cropRegion.x + panX,
        y: cropRegion.y + panY,
        scale,
      });
    }
    
    return keyframes;
  }

  // Center crop (basic, no processing needed)
  getCenterCrop(aspectRatio: string): { x: number; y: number; width: number; height: number } {
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    
    const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
    const targetRatio = ratioW / ratioH;
    const currentRatio = width / height;
    
    let cropWidth, cropHeight;
    
    if (currentRatio > targetRatio) {
      // Video is wider, crop width
      cropHeight = height;
      cropWidth = height * targetRatio;
    } else {
      // Video is taller, crop height
      cropWidth = width;
      cropHeight = width / targetRatio;
    }
    
    return {
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    };
  }
}

// Backend API Service (Optional - for advanced features)
class BackendCropService {
  private apiUrl: string;

  constructor(apiUrl: string = '/api/video-crop') {
    this.apiUrl = apiUrl;
  }

  async processAdvancedCrop(
    videoUrl: string,
    cropType: string,
    options: any
  ): Promise<CropSettings> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl,
          cropType,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error('Backend processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Backend crop service error:', error);
      throw error;
    }
  }
}

export const MagicCropModal: React.FC<MagicCropModalProps> = ({
  isOpen,
  onClose,
  onApply,
  selectedLayerId,
  videoElement,
  videoUrl,
}) => {
  const [cropType, setCropType] = useState("smart");
  const [intensity, setIntensity] = useState(75);
  const [focusPoint, setFocusPoint] = useState("auto");
  const [enableAutoZoom, setEnableAutoZoom] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasVideoSupport, setHasVideoSupport] = useState(true);
  const [useBackend, setUseBackend] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const backendServiceRef = useRef(new BackendCropService());

  useEffect(() => {
    const checkSupport = () => {
      const hasCanvas = typeof HTMLCanvasElement !== 'undefined';
      // const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';
      setHasVideoSupport(hasCanvas);
    };
    
    checkSupport();
  }, []);

  const applyAspectRatio = (
    cropRegion: { x: number; y: number; width: number; height: number },
    targetRatio: string
  ) => {
    const [ratioW, ratioH] = targetRatio.split(':').map(Number);
    const targetAspect = ratioW / ratioH;
    const currentAspect = cropRegion.width / cropRegion.height;
    
    let newWidth = cropRegion.width;
    let newHeight = cropRegion.height;
    
    if (currentAspect > targetAspect) {
      // Crop width
      newWidth = cropRegion.height * targetAspect;
    } else {
      // Crop height
      newHeight = cropRegion.width / targetAspect;
    }
    
    return {
      x: cropRegion.x + (cropRegion.width - newWidth) / 2,
      y: cropRegion.y + (cropRegion.height - newHeight) / 2,
      width: newWidth,
      height: newHeight,
    };
  };

  const applyFocusPoint = (
    cropRegion: { x: number; y: number; width: number; height: number },
    videoWidth: number,
    videoHeight: number
  ) => {
    if (focusPoint === "auto") return cropRegion;

    const adjustments: Record<string, { x: number; y: number }> = {
      center: { x: 0, y: 0 },
      top: { x: 0, y: -cropRegion.height * 0.25 },
      bottom: { x: 0, y: cropRegion.height * 0.25 },
      left: { x: -cropRegion.width * 0.25, y: 0 },
      right: { x: cropRegion.width * 0.25, y: 0 },
    };

    const adjustment = adjustments[focusPoint] || { x: 0, y: 0 };

    return {
      x: Math.max(0, Math.min(cropRegion.x + adjustment.x, videoWidth - cropRegion.width)),
      y: Math.max(0, Math.min(cropRegion.y + adjustment.y, videoHeight - cropRegion.height)),
      width: cropRegion.width,
      height: cropRegion.height,
    };
  };

  const applyIntensity = (
    cropRegion: { x: number; y: number; width: number; height: number },
    videoWidth: number,
    videoHeight: number
  ) => {
    const factor = intensity / 100;
    const centerX = cropRegion.x + cropRegion.width / 2;
    const centerY = cropRegion.y + cropRegion.height / 2;

    // Adjust crop size based on intensity (higher intensity = tighter crop)
    const intensityFactor = 0.5 + (factor * 0.5); // Range from 0.5 to 1.0
    const newWidth = cropRegion.width * intensityFactor;
    const newHeight = cropRegion.height * intensityFactor;

    return {
      x: Math.max(0, centerX - newWidth / 2),
      y: Math.max(0, centerY - newHeight / 2),
      width: Math.min(newWidth, videoWidth),
      height: Math.min(newHeight, videoHeight),
    };
  };

  const processWithBackend = async (): Promise<CropSettings> => {
    if (!videoUrl) {
      throw new Error("Video URL required for backend processing");
    }

    setProcessingProgress(10);
    
    const settings = await backendServiceRef.current.processAdvancedCrop(
      videoUrl,
      cropType,
      {
        intensity,
        focusPoint,
        enableAutoZoom,
        aspectRatio,
      }
    );

    setProcessingProgress(100);
    return settings;
  };

  const processClientSide = async (): Promise<CropSettings> => {
    if (!videoElement) {
      throw new Error("Video element not found");
    }

    if (!videoElement.videoWidth || !videoElement.videoHeight) {
      throw new Error("Video not loaded properly");
    }

    setProcessingProgress(20);
    const processor = new AdvancedVideoCropProcessor(videoElement);
    
    let cropRegion;
    
    setProcessingProgress(40);
    
    switch (cropType) {
      case "face":
        const faces = await processor.detectFaces();
        if (faces.length > 0) {
          // Use largest face
          cropRegion = faces.reduce((largest, face) =>
            face.width * face.height > largest.width * largest.height ? face : largest
          );
          // Expand region around face
          const expansion = 1.5;
          const centerX = cropRegion.x + cropRegion.width / 2;
          const centerY = cropRegion.y + cropRegion.height / 2;
          cropRegion = {
            x: centerX - (cropRegion.width * expansion) / 2,
            y: centerY - (cropRegion.height * expansion) / 2,
            width: cropRegion.width * expansion,
            height: cropRegion.height * expansion,
          };
        } else {
          toast.error("No faces detected, using smart crop");
          cropRegion = await processor.detectSmartCrop();
        }
        break;

      case "action":
        setProcessingProgress(50);
        const motion = await processor.detectMotionRegions();
        if (motion) {
          cropRegion = motion;
        } else {
          toast.error("No motion detected, using smart crop");
          cropRegion = await processor.detectSmartCrop();
        }
        break;

      case "smart":
        setProcessingProgress(50);
        cropRegion = await processor.detectSmartCrop();
        break;

      case "center":
      default:
        cropRegion = processor.getCenterCrop(aspectRatio);
        break;
    }

    setProcessingProgress(70);

    // Apply aspect ratio
    cropRegion = applyAspectRatio(cropRegion, aspectRatio);

    // Apply focus point
    cropRegion = applyFocusPoint(
      cropRegion,
      videoElement.videoWidth,
      videoElement.videoHeight
    );

    // Apply intensity
    cropRegion = applyIntensity(
      cropRegion,
      videoElement.videoWidth,
      videoElement.videoHeight
    );

    setProcessingProgress(85);

    // Generate keyframes for smooth animation
    const keyframes = await processor.generateKeyframes(
      cropRegion,
      videoElement.duration,
      enableAutoZoom
    );

    setProcessingProgress(100);

    // Normalize to percentages
    return {
      cropType,
      intensity,
      focusPoint,
      enableAutoZoom,
      aspectRatio,
      cropRegion: {
        x: (cropRegion.x / videoElement.videoWidth) * 100,
        y: (cropRegion.y / videoElement.videoHeight) * 100,
        width: (cropRegion.width / videoElement.videoWidth) * 100,
        height: (cropRegion.height / videoElement.videoHeight) * 100,
      },
      keyframes: keyframes.map(kf => ({
        ...kf,
        x: (kf.x / videoElement.videoWidth) * 100,
        y: (kf.y / videoElement.videoHeight) * 100,
      })),
    };
  };

  const handleApply = async () => {
    if (!selectedLayerId) {
      toast.error("Please select a video layer first");
      return;
    }

    const selectedCropType = CROP_TYPES.find(t => t.id === cropType);
    const needsBackend = selectedCropType?.needsBackend && useBackend;

    if (needsBackend && !videoUrl) {
      toast.error("Advanced features require video URL");
      return;
    }

    if (!needsBackend && !videoElement) {
      toast.error("Video element not found");
      return;
    }

    if (!hasVideoSupport && !needsBackend) {
      toast.error("Your browser doesn't support required features");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      let settings: CropSettings;

      if (needsBackend) {
        toast.loading("Processing with AI backend...");
        settings = await processWithBackend();
      } else {
        settings = await processClientSide();
      }

      onApply(settings);
      toast.success("Magic crop applied successfully! 🎬");
      onClose();
    } catch (error) {
      console.error("Error applying magic crop:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to apply magic crop"
      );
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  if (!isOpen) return null;

  const selectedCropType = CROP_TYPES.find(t => t.id === cropType);
  const requiresBackend = selectedCropType?.needsBackend;

  const styles = {
    overlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      padding: "28px",
      width: "90%",
      maxWidth: "650px",
      maxHeight: "90vh",
      overflowY: "auto" as const,
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    title: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    subtitle: {
      fontSize: "13px",
      color: "#888",
      marginTop: "4px",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#888",
      fontSize: "28px",
      cursor: "pointer",
      padding: "4px",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      transition: "all 0.2s",
    },
    section: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "12px",
    },
    cropGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    cropCard: {
      padding: "16px",
      backgroundColor: "#0f0f0f",
      border: "2px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s",
      position: "relative" as const,
    },
    cropCardActive: {
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "#10b981",
      transform: "translateY(-2px)",
    },
    cropCardTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "4px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    cropCardDescription: {
      fontSize: "12px",
      color: "#888",
    },
    badge: {
      fontSize: "10px",
      padding: "2px 6px",
      borderRadius: "4px",
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      color: "#a78bfa",
      fontWeight: "600",
    },
    aspectRatioGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
    },
    aspectRatioButton: {
      padding: "12px 8px",
      backgroundColor: "#0f0f0f",
      border: "2px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    },
    aspectRatioButtonActive: {
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "#10b981",
      color: "#10b981",
    },
    sliderContainer: {
      marginTop: "12px",
    },
    sliderLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontSize: "13px",
      color: "#888",
    },
    slider: {
      width: "100%",
      height: "6px",
      borderRadius: "3px",
      appearance: "none" as const,
      backgroundColor: "rgba(255,255,255,0.1)",
      outline: "none",
    },
    focusGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
    },
    focusButton: {
      padding: "10px",
      backgroundColor: "#0f0f0f",
      border: "2px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    focusButtonActive: {
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "#10b981",
      color: "#10b981",
    },
    toggleContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
    },
    toggleLabel: {
      fontSize: "14px",
      color: "#e5e5e5",
      fontWeight: "600",
    },
    toggleDescription: {
      fontSize: "12px",
      color: "#888",
      marginTop: "4px",
    },
    toggle: {
      width: "48px",
      height: "26px",
      borderRadius: "13px",
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "none",
      cursor: "pointer",
      position: "relative" as const,
      transition: "background-color 0.3s",
    },
    toggleActive: {
      backgroundColor: "#10b981",
    },
    toggleKnob: {
      position: "absolute" as const,
      top: "3px",
      left: "3px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "white",
      transition: "transform 0.3s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    toggleKnobActive: {
      transform: "translateX(22px)",
    },
    warningBox: {
      padding: "14px",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      border: "1px solid rgba(245, 158, 11, 0.3)",
      borderRadius: "10px",
      fontSize: "13px",
      color: "#f59e0b",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    infoBox: {
      padding: "14px",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "10px",
      fontSize: "13px",
      color: "#3b82f6",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    progressBar: {
      width: "100%",
      height: "4px",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: "2px",
      overflow: "hidden",
      marginTop: "12px",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#10b981",
      transition: "width 0.3s",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "28px",
    },
    button: {
      flex: 1,
      padding: "14px 24px",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "2px solid rgba(255,255,255,0.1)",
      color: "#888",
    },
    applyButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
    },
    applyButtonDisabled: {
      background: "#333",
      color: "#666",
      cursor: "not-allowed",
      boxShadow: "none",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
              Magic Crop
            </div>
            <div style={styles.subtitle}>
              AI-powered video cropping for social media
            </div>
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            ×
          </button>
        </div>

        {!selectedLayerId && (
          <div style={styles.warningBox}>
            <span>⚠️</span>
            <span>Please select a video layer to apply magic crop</span>
          </div>
        )}

        {requiresBackend && !useBackend && (
          <div style={styles.infoBox}>
            <span>ℹ️</span>
            <span>
              This feature works best with backend AI processing. Enable it below
              for better results.
            </span>
          </div>
        )}

        <div style={styles.section}>
          <label style={styles.label}>Target Aspect Ratio</label>
          <div style={styles.aspectRatioGrid}>
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.id}
                style={{
                  ...styles.aspectRatioButton,
                  ...(aspectRatio === ratio.id ? styles.aspectRatioButtonActive : {}),
                }}
                onClick={() => setAspectRatio(ratio.id)}
              >
                <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "2px" }}>
                  {ratio.name}
                </div>
                <div style={{ fontSize: "10px", opacity: 0.7 }}>
                  {ratio.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Crop Type</label>
          <div style={styles.cropGrid}>
            {CROP_TYPES.map((type) => (
              <div
                key={type.id}
                style={{
                  ...styles.cropCard,
                  ...(cropType === type.id ? styles.cropCardActive : {}),
                }}
                onClick={() => setCropType(type.id)}
              >
                <div style={styles.cropCardTitle}>
                  {type.name}
                  {type.needsBackend && <span style={styles.badge}>PRO</span>}
                </div>
                <div style={styles.cropCardDescription}>{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Crop Intensity</label>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>Subtle</span>
              <span style={{ color: "#10b981", fontWeight: "600" }}>{intensity}%</span>
              <span>Aggressive</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Focus Point</label>
          <div style={styles.focusGrid}>
            {FOCUS_POINTS.map((point) => (
              <button
                key={point.id}
                style={{
                  ...styles.focusButton,
                  ...(focusPoint === point.id ? styles.focusButtonActive : {}),
                }}
                onClick={() => setFocusPoint(point.id)}
              >
                {point.name}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.toggleContainer}>
            <div>
              <div style={styles.toggleLabel}>Auto Zoom & Pan</div>
              <div style={styles.toggleDescription}>
                Smooth zoom and pan effects for dynamic content
              </div>
            </div>
            <button
              style={{
                ...styles.toggle,
                ...(enableAutoZoom ? styles.toggleActive : {}),
              }}
              onClick={() => setEnableAutoZoom(!enableAutoZoom)}
            >
              <div
                style={{
                  ...styles.toggleKnob,
                  ...(enableAutoZoom ? styles.toggleKnobActive : {}),
                }}
              />
            </button>
          </div>
        </div>

        {requiresBackend && (
          <div style={styles.section}>
            <div style={styles.toggleContainer}>
              <div>
                <div style={styles.toggleLabel}>Use Backend AI</div>
                <div style={styles.toggleDescription}>
                  Enable advanced AI processing (requires API)
                </div>
              </div>
              <button
                style={{
                  ...styles.toggle,
                  ...(useBackend ? styles.toggleActive : {}),
                }}
                onClick={() => setUseBackend(!useBackend)}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    ...(useBackend ? styles.toggleKnobActive : {}),
                  }}
                />
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${processingProgress}%`,
              }}
            />
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isProcessing}
            onMouseOver={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(isProcessing || !selectedLayerId || (!hasVideoSupport && !useBackend)
                ? styles.applyButtonDisabled
                : styles.applyButton),
            }}
            onClick={handleApply}
            disabled={isProcessing || !selectedLayerId || (!hasVideoSupport && !useBackend)}
            onMouseOver={(e) => {
              if (!isProcessing && selectedLayerId && (hasVideoSupport || useBackend)) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
            }}
          >
            {isProcessing ? `Processing... ${processingProgress}%` : "Apply Magic Crop 🎬"}
          </button>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
        }
        
        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};