import React, { useState } from 'react';
import { CameraUpload } from './CameraUpload';
import { RecommendationCard } from './RecommendationCard';
import { AIClassificationResult, ScanRecord } from '../../types/waste';
import { WasteClassifierService } from '../../models/wasteClassifier';
import { Sparkles, Sliders, ArrowLeft, RefreshCw, CheckCircle2, Cpu, X, Info } from 'lucide-react';

interface ScannerViewProps {
  uncertaintyThreshold: number;
  setUncertaintyThreshold: (val: number) => void;
  onRecordSaved: (record: ScanRecord) => void;
  showDemoRecords: boolean;
  preselectedSampleId?: string | null;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  uncertaintyThreshold,
  setUncertaintyThreshold,
  onRecordSaved,
  showDemoRecords,
  preselectedSampleId = null,
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(preselectedSampleId);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [classification, setClassification] = useState<AIClassificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState<boolean>(false);

  const handleStartAnalysis = async () => {
    if (!rawBase64 && !selectedSampleId) {
      setErrorMessage('Please upload an image, capture webcam photo, or select a sample first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await WasteClassifierService.classifyImage(
        rawBase64 || '',
        mimeType,
        selectedSampleId || undefined
      );
      setClassification(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Inference error';
      setErrorMessage(`Failed to analyze waste item: ${msg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImagePreviewUrl(null);
    setSelectedSampleId(null);
    setRawBase64(null);
    setClassification(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header & Threshold Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            AI Waste Scanner & Rules Engine
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Real-time vision classification, uncertainty guardrails, and deterministic circular routing
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setShowDiagnosticsModal(true)}
              className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Pipeline: SmartSeg_EfficientNetV2B0 / Gemini 3.8 Flash
            </button>
          </div>
        </div>

        {/* Configurable Uncertainty Threshold Slider */}
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-1 min-w-[240px]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-stone-500" />
              Uncertainty Threshold:
            </span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
              {(uncertaintyThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.90"
            step="0.05"
            value={uncertaintyThreshold}
            onChange={(e) => setUncertaintyThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-[10px] text-stone-400 block text-right">
            Scores below trigger human verification
          </span>
        </div>
      </div>

      {/* Model & Inference Diagnostics Modal */}
      {showDiagnosticsModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                AI Inference Pipeline & Model Specifications
              </h3>
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">1. Local Pretrained Model Architecture</span>
                <p>• Model File Target: <code className="text-emerald-700 font-mono">/models/SmartSeg_EfficientNetV2B0_REVISED.keras</code></p>
                <p>• Input Resolution: <span className="font-mono">224 x 224 x 3 (RGB)</span></p>
                <p>• Normalization: <span className="font-mono">[-1.0, 1.0] (EfficientNet standard)</span></p>
                <p>• Head: Softmax dense activation across 8 standardized waste classes</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 block">2. Multimodal Server Inference</span>
                <p>• Engine: Google GenAI SDK with <code className="font-mono font-bold text-emerald-800">gemini-3.8-flash</code></p>
                <p>• Endpoint: Server-side proxy at <code className="font-mono text-emerald-800">/api/classify</code></p>
                <p>• Output Format: Validated JSON matching strict material schemas</p>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-1">
                <span className="font-bold text-teal-950 block">3. Resilient Fallback Engine</span>
                <p>• 100% offline-ready benchmark classifier for instant testing during zero-connectivity hackathon evaluations.</p>
                <p>• Explicitly marks demonstration records to guarantee full audit integrity.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-bold text-xs"
              >
                Close Model Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Input Stage */}
      {!classification ? (
        <CameraUpload
          imagePreviewUrl={imagePreviewUrl}
          setImagePreviewUrl={setImagePreviewUrl}
          selectedSampleId={selectedSampleId}
          setSelectedSampleId={setSelectedSampleId}
          rawBase64={rawBase64}
          setRawBase64={setRawBase64}
          mimeType={mimeType}
          setMimeType={setMimeType}
          onImageReady={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
        />
      ) : (
        /* Results & Action Recommendation Stage */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Scan Another Item
            </button>

            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Analysis Complete
            </span>
          </div>

          <RecommendationCard
            classification={classification}
            uncertaintyThreshold={uncertaintyThreshold}
            onSaveRecord={onRecordSaved}
            imagePreviewUrl={imagePreviewUrl || undefined}
            isDemoRecord={showDemoRecords}
          />
        </div>
      )}
    </div>
  );
};
