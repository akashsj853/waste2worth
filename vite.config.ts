import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function wasteClassifierApiPlugin(): Plugin {
  return {
    name: 'waste-classifier-api',
    configureServer(server) {
      server.middlewares.use('/api/classify', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { imageBase64, mimeType = 'image/jpeg', sampleId } = data;

            if (sampleId) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fallback: true, sampleId }));
              return;
            }

            if (!imageBase64 || typeof imageBase64 !== 'string') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing or invalid imageBase64 in request body' }));
              return;
            }

            // Extract base64 payload and detect mimeType safely
            let cleanBase64 = imageBase64.trim();
            let resolvedMime = mimeType;

            if (cleanBase64.includes(';base64,')) {
              const parts = cleanBase64.split(';base64,');
              const header = parts[0].replace(/^data:/, '');
              if (header) resolvedMime = header;
              cleanBase64 = parts[1] || '';
            } else if (cleanBase64.startsWith('data:')) {
              // Non-base64 data URI (e.g. utf8 SVG)
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fallback: true, message: 'Non-base64 image payload' }));
              return;
            }

            // Remove any whitespace or newlines from base64
            cleanBase64 = cleanBase64.replace(/\s+/g, '');

            // Ensure MIME type is a supported raster image type for Gemini Vision
            if (resolvedMime.includes('svg')) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fallback: true, message: 'SVG format redirected to fallback classifier' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  fallback: true,
                  message: 'No GEMINI_API_KEY found in server environment, using fallback classifier.',
                })
              );
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const prompt = `You are the core computer vision inference engine for Waste2Worth AI.
Carefully inspect this waste item image. Classify it strictly into ONE of the following 8 standardized categories:
1. "Organic food scraps"
2. "Plastic"
3. "Paper and cardboard"
4. "Metal"
5. "Glass"
6. "Textile"
7. "Electronic waste"
8. "Other or unknown"

Analyze composition, visible branding or resin symbols, and contamination (grease, food residue, liquids, or mixed layers).
Return valid JSON matching this structure:
{
  "predictedCategory": "Organic food scraps" | "Plastic" | "Paper and cardboard" | "Metal" | "Glass" | "Textile" | "Electronic waste" | "Other or unknown",
  "confidenceScore": number, // Raw model probability between 0.05 and 0.99
  "alternativePredictions": [
    { "category": string, "confidence": number, "reasoning": string }
  ],
  "detectedItemName": string, // e.g. "Crushed Aluminum Soda Can", "PET Plastic Water Bottle"
  "compositionDetail": string, // Technical material analysis, e.g. "Alloy 3004 with 5182 pull tab"
  "contaminationStatus": "clean_rinsed" | "clean" | "light_food_residue" | "heavily_soiled" | "mixed_materials",
  "visualNotes": string // Concise visual rationale
}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: {
                parts: [
                  {
                    inlineData: {
                      mimeType: resolvedMime,
                      data: cleanBase64,
                    },
                  },
                  { text: prompt },
                ],
              },
              config: {
                responseMimeType: 'application/json',
              },
            });

            const responseText = response.text || '{}';
            let parsedResult;
            try {
              parsedResult = JSON.parse(responseText);
            } catch {
              parsedResult = {
                predictedCategory: 'Other or unknown',
                confidenceScore: 0.50,
                detectedItemName: 'Scanned Material',
                compositionDetail: 'Uncertain material boundaries',
                contaminationStatus: 'light_food_residue',
                visualNotes: responseText.slice(0, 200),
                alternativePredictions: [],
              };
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                source: 'gemini_vision',
                data: parsedResult,
              })
            );
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Inference error';
            console.error('Gemini vision inference error:', message);
            res.statusCode = 200; // Return 200 with fallback indicator so client gracefully degrades
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                fallback: true,
                error: message,
              })
            );
          }
        });
      });

      // AI Sustainability Assistant Endpoint
      server.middlewares.use('/api/assistant', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { message, context = '' } = data;

            if (!message) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing message parameter' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  fallback: true,
                  reply:
                    "I am the Waste2Worth AI Sustainability Advisor operating in resilient offline mode. For optimal resource recovery:\n\n1. Ensure paper and cardboard are clean and free from food grease before placing them in dry recycling bins.\n2. Rigid plastics (#1 PET and #2 HDPE) should be rinsed clean.\n3. Lithium batteries and electronics must be isolated and brought to certified WEEE depots to prevent compactor fires.\n4. When composting cafeteria food scraps, maintain a 2:1 ratio of dry carbonaceous browns (leaves, unprinted cardboard) to wet nitrogen greens to prevent anaerobic odor.\n\nConfigure GEMINI_API_KEY for dynamic real-time querying.",
                })
              );
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const systemInstruction = `You are the Waste2Worth AI Sustainability Assistant — an expert circular economy, waste segregation, and agronomic composting advisor for university campuses, hostels, dining halls, and households.
Rules:
- Give concise, highly practical, technically accurate answers with bullet points.
- Always distinguish between what is locally recyclable vs. what requires specialized collection or causes batch contamination.
- When answering composting questions, refer to the 25:1 to 30:1 C:N ratio, biological mass loss (55-70%), and phytotoxicity warnings against applying uncured compost.
- If context is provided, ground your answer in the current campus audit statistics.
- Never invent unscientific carbon offset claims.`;

            const prompt = `Context: ${context}\n\nUser Question: ${message}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                systemInstruction,
              },
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                reply: response.text || 'I could not generate an answer at this time.',
              })
            );
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Assistant error';
            console.error('Assistant API error:', errorMsg);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                fallback: true,
                reply:
                  "I encountered a temporary service glitch, but here is standard Waste2Worth guidance: Separate clean dry recyclables from wet organics. Ensure all containers are rinsed, never place batteries in curbside recycling bins, and balance wet kitchen scraps with twice as much dry leaf or shredded cardboard brown matter in composters.",
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), wasteClassifierApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
