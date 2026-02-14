const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const getGenerativePart = async (source) => {
  try {
    let buffer;
    let mimeType;

    if (source.startsWith('http')) {
      console.log(`[Backend - Gemini Service] Fetching remote file: ${source}`);
      const response = await axios.get(source, { responseType: 'arraybuffer' });
      buffer = Buffer.from(response.data);
      mimeType = response.headers['content-type'];
    } else {
      // Assume local file path
      console.log(`[Backend - Gemini Service] Reading local file: ${source}`);
      if (!fs.existsSync(source)) {
        console.warn(`[Backend - Gemini Service] Local file not found: ${source}`);
        return null;
      }
      buffer = fs.readFileSync(source);
      // Simple mime-type detection based on extension
      const ext = source.split('.').pop().toLowerCase();
      mimeType = ext === 'pdf' ? 'application/pdf' : `image/${ext}`;
    }

    console.log(`[Backend - Gemini Service] Content ready. Type: ${mimeType}, Size: ${buffer.length} bytes`);

    if (!mimeType.includes('image') && !mimeType.includes('pdf')) {
      console.warn(`[Backend - Gemini Service] Unsupported mime-type: ${mimeType}`);
      return null;
    }

    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimeType
      }
    };
  } catch (error) {
    console.error(`[Backend - Gemini Service] Error processing source: ${source}`, error.message);
    return null;
  }
};

// Function to generate summary
const generateSummary = async (transcriptText = '', userNotes = '', imageUrls = [], localFilePaths = []) => {
  try {
    let API_KEY = process.env.GEMINI_API_KEY;
    if (API_KEY) API_KEY = API_KEY.trim();

    if (!API_KEY) {
      console.error('[Backend - Gemini API] Error: GEMINI_API_KEY is missing in process.env');
      throw new Error("GEMINI_API_KEY is missing.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Using full model paths as some environments are strict
    const model20 = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const model15 = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

    // Combine transcript and notes into one text block
    let combinedText = '';
    if (transcriptText && userNotes) {
      combinedText = `${transcriptText}\n\n--- Additional Notes ---\n${userNotes}`;
    } else if (transcriptText) {
      combinedText = transcriptText;
    } else if (userNotes) {
      combinedText = userNotes;
    } else {
      combinedText = 'None provided.';
    }

    const prompt = `
        You are an expert meeting assistant. Please analyze the following sources:
        1. Meeting Content (transcript from audio + manual notes)
        2. Attached images/PDFs (whiteboards, documents, slides)
        
        Combine the information from all available sources into one cohesive summary.
        
        Strictly follow this format with **bold headings** and clear spacing:

        # (Meeting Title based on content)

        **Executive Summary**
        (3–4 sentences summarizing the core purpose and outcome)

        **Key Discussion Points**
        * (Discussion Point 1)
          - (Detail)
        * (Discussion Point 2)
          - (Detail)

        **Action Items**
        1. (Action Item 1)
        2. (Action Item 2)

        ---
        Meeting Content:
        ${combinedText}

        Instruction: Integrate everything into a structured summary. Use Markdown for bolding and lists. Ensure there is an empty line between every major heading/section.
        `;

    console.log('[Backend - Gemini API] Preparing Multimodal Request...');

    const parts = [{ text: prompt }];

    // Combine all inputs (URLs and local paths)
    const sources = [...imageUrls, ...localFilePaths];

    if (sources.length > 0) {
      console.log(`[Backend - Gemini API] Processing ${sources.length} visual/doc sources...`);
      for (const src of sources) {
        const part = await getGenerativePart(src);
        if (part) {
          parts.push(part);
        }
      }
    }

    console.log('[Backend - Gemini API] Final Prompt Parts Count:', parts.length);

    // Simple Retry Helper for Quota Errors with Model Fallback
    const generateWithRetry = async (parts, retries = 3, useFallback = false) => {
      const activeModel = useFallback ? model15 : model20;
      const modelName = useFallback ? "models/gemini-flash-latest" : "models/gemini-2.0-flash";

      try {
        console.log(`[Backend - Gemini API] Attempting generation with ${modelName}...`);
        return await activeModel.generateContent(parts);
      } catch (error) {
        // Handle BOTH Quota (429) and Overloaded (503) errors with fallback
        const isRetryable = error.message.includes('429') ||
          error.message.includes('quota') ||
          error.message.includes('503') ||
          error.message.includes('overloaded');

        if (retries > 0 && isRetryable) {
          console.warn(`[Backend - Gemini API] ${modelName} issue. Switching models/retrying in 5s... (${retries} left)`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          return generateWithRetry(parts, retries - 1, !useFallback);
        }
        throw error;
      }
    };

    const result = await generateWithRetry(parts);
    const response = await result.response;
    const text = response.text();

    console.log('[Backend - Gemini API] Summary generated successfully.');
    return text;

  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message || "Unknown Gemini API Error";
    console.error(`[Backend - Gemini API] CRITICAL ERROR: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

module.exports = { generateSummary };
