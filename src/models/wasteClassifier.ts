import { AIClassificationResult, ContaminationStatus, WasteCategory } from '../types/waste';
import { FallbackClassifier } from './fallbackClassifier';

export interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export class WasteClassifierService {
  public static readonly MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  public static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/svg+xml',
  ];

  public static validateFile(file: File): FileValidationResult {
    if (!file) {
      return { isValid: false, errorMessage: 'No file selected.' };
    }

    if (!WasteClassifierService.ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        errorMessage: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPEG, PNG, or WEBP image.`,
      };
    }

    if (file.size > WasteClassifierService.MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        isValid: false,
        errorMessage: `File is too large (${sizeMb} MB). Maximum supported size is 10 MB.`,
      };
    }

    return { isValid: true };
  }

  public static async classifyImage(
    base64Data: string,
    mimeType = 'image/jpeg',
    sampleId?: string
  ): Promise<AIClassificationResult> {
    // If a curated sample is selected, immediately return calibrated benchmark inference
    if (sampleId) {
      return FallbackClassifier.classifyFromSample(sampleId);
    }

    // If data is SVG (which Gemini does not accept as raster bytes), use fallback
    if (base64Data.startsWith('data:image/svg') || mimeType === 'image/svg+xml') {
      return FallbackClassifier.classifyGeneric();
    }

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType,
          sampleId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        const confidence = typeof d.confidenceScore === 'number' ? Math.min(1, Math.max(0, d.confidenceScore)) : 0.85;

        return {
          predictedCategory: (d.predictedCategory as WasteCategory) || 'Other or unknown',
          confidenceScore: confidence,
          alternativePredictions: Array.isArray(d.alternativePredictions) ? d.alternativePredictions : [],
          isUncertain: confidence < 0.70 || d.predictedCategory === 'Other or unknown',
          detectedItemName: d.detectedItemName || 'Analyzed Item',
          compositionDetail: d.compositionDetail || 'Mixed or composite materials',
          contaminationStatus: (d.contaminationStatus as ContaminationStatus) || 'clean',
          visualNotes: d.visualNotes || 'Identified via multimodal vision inspection.',
          source: 'gemini_vision',
        };
      }

      // If server returned fallback indicator:
      console.info('Server requested fallback inference:', json.message || json.error);
      if (sampleId) {
        return FallbackClassifier.classifyFromSample(sampleId);
      }
      return FallbackClassifier.classifyGeneric();
    } catch (err) {
      console.warn('API inference error, invoking resilient client fallback:', err);
      if (sampleId) {
        return FallbackClassifier.classifyFromSample(sampleId);
      }
      return FallbackClassifier.classifyGeneric();
    }
  }
}
