import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import { SAMPLE_WASTE_ITEMS, SampleWasteItem } from '../../data/sampleImages';
import { WasteClassifierService } from '../../models/wasteClassifier';

interface CameraUploadProps {
  imagePreviewUrl: string | null;
  setImagePreviewUrl: (url: string | null) => void;
  selectedSampleId: string | null;
  setSelectedSampleId: (id: string | null) => void;
  rawBase64: string | null;
  setRawBase64: (b64: string | null) => void;
  mimeType: string;
  setMimeType: (mime: string) => void;
  onImageReady: () => void;
  isAnalyzing: boolean;
}

export const CameraUpload: React.FC<CameraUploadProps> = ({
  imagePreviewUrl,
  setImagePreviewUrl,
  selectedSampleId,
  setSelectedSampleId,
  setRawBase64,
  mimeType,
  setMimeType,
  onImageReady,
  isAnalyzing,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'sample'>('sample');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access camera';
      setErrorMessage(`Camera access denied or unavailable: ${msg}. Please upload an image or choose a demo sample.`);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setImagePreviewUrl(dataUrl);
    setRawBase64(dataUrl);
    setMimeType('image/jpeg');
    setSelectedSampleId(null);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = WasteClassifierService.validateFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Invalid file.');
      return;
    }

    setMimeType(file.type || 'image/jpeg');
    setSelectedSampleId(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreviewUrl(result);
      setRawBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleWasteItem) => {
    setErrorMessage(null);
    setSelectedSampleId(sample.id);
    setImagePreviewUrl(sample.svgIcon);
    setRawBase64(sample.svgIcon);
    setMimeType('image/svg+xml');
  };

  const handleClear = () => {
    setImagePreviewUrl(null);
    setRawBase64(null);
    setSelectedSampleId(null);
    setErrorMessage(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
      {/* Tab Switcher: Upload / Camera / Sample */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <h3 className="font-extrabold text-stone-900 text-lg">Input Waste Item</h3>
          <p className="text-xs text-stone-500">
            Upload a photo, capture live webcam footage, or select a calibrated sample
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveMode('sample');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeMode === 'sample' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Curated Samples
          </button>
          <button
            onClick={() => {
              setActiveMode('upload');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeMode === 'upload' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-stone-600" />
            Upload File
          </button>
          <button
            onClick={() => {
              setActiveMode('camera');
              startCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeMode === 'camera' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-stone-600" />
            Live Camera
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mode 1: Curated Samples (Instant 1-Click for Judges) */}
      {activeMode === 'sample' && !imagePreviewUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Select Curated Hackathon Sample (Click to Inspect)
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              8 Real-World Streams
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_WASTE_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectSample(item)}
                className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col items-center text-center space-y-2 cursor-pointer ${
                  selectedSampleId === item.id
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xs border border-stone-200/60 bg-white flex items-center justify-center p-1">
                  <img src={item.svgIcon} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700 block truncate">
                    {item.badge}
                  </span>
                  <p className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {item.category}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: File Upload Dropzone */}
      {activeMode === 'upload' && !imagePreviewUrl && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-stone-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer space-y-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800">
              Click to select or drag & drop waste image
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Supports JPEG, PNG, WEBP up to 10 MB. Preprocessed for vision classification.
            </p>
          </div>
        </div>
      )}

      {/* Mode 3: Live Camera Feed */}
      {activeMode === 'camera' && !imagePreviewUrl && (
        <div className="space-y-4">
          <div className="relative aspect-video max-h-80 bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/60 rounded-2xl m-4" />
                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur px-2.5 py-1 rounded-md text-[11px] text-stone-300">
                  Align waste item inside the frame
                </div>
              </>
            ) : (
              <div className="text-stone-400 text-center p-6 space-y-2">
                <Camera className="w-10 h-10 mx-auto text-stone-500" />
                <p className="text-sm">Camera inactive or starting...</p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Restart Camera
                </button>
              </div>
            )}
          </div>

          {isCameraActive && (
            <button
              onClick={capturePhoto}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Capture Snapshot for Analysis
            </button>
          )}
        </div>
      )}

      {/* Preview Area (When an Image is Selected / Captured) */}
      {imagePreviewUrl && (
        <div className="space-y-4">
          <div className="relative rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 max-h-72 flex items-center justify-center p-4">
            <img
              src={imagePreviewUrl}
              alt="Waste preview"
              className="max-h-64 max-w-full object-contain rounded-xl shadow-xs"
            />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors"
              title="Remove and choose another image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onImageReady}
              disabled={isAnalyzing}
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-400 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running AI Multimodal Inference...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Analyze Waste Item with AI
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={isAnalyzing}
              className="px-4 py-3 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl font-semibold text-sm transition-colors"
            >
              Choose Different Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
