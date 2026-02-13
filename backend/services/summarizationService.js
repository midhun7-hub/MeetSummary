const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Summarization Service
 * Uses Google Gemini 1.5 Pro via SDK for Multimodal support.
 */

// Helper to fetch image/file from URL and convert to generative-ai part
const urlToGenerativePart = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'base64');
    const mimeType = response.headers['content-type'];

    // Gemini supports images and PDFs
    if (!mimeType.includes('image') && !mimeType.includes('pdf')) {
      console.warn(`[Backend - Gemini Service] Skipping unsupported mime-type: ${mimeType}`);
      return null;
    }

    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimeType
      }
    };
  } catch (error) {
    console.error(`[Backend - Gemini Service] Error fetching file URL: ${url}`, error.message);
    return null;
  }
};

// Function to generate summary
const generateSummary = async (transcriptText = '', userNotes = '', imageUrls = []) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('[Backend - Gemini API] Error: GEMINI_API_KEY is missing in process.env');
      throw new Error("GEMINI_API_KEY is missing.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Using gemini-1.5-flash as it is more widely available and faster for multimodal tasks
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert meeting assistant. Please analyze the following sources:
        1. Meeting Transcript (from audio)
        2. User manual notes
        3. Attached images/PDFs (whiteboards, documents, slides)
        
        Combine the information from all available sources into one cohesive summary. Note that some sources might be missing (e.g., there might be no transcript, only notes and images). Use whatever is provided.
        
        Strictly follow this format:

        Main Heading: (Meeting Title based on content)

        Executive Summary: (3–4 sentences summarizing the core purpose and outcome)

        Key Discussion Points:
        * (Discussion Point 1)
          - (Detail)
        * (Discussion Point 2)
          - (Detail)

        Action Items:
        1. (Action Item 1)
        2. (Action Item 2)

        ---
        Meeting Transcript:
        ${transcriptText || 'None provided.'}

        User Manual Notes:
        ${userNotes || 'None provided.'}

        Instruction: Integrate everything into a structured summary with headings, subheadings, and action items. If documents (PDFs) or images are attached, extract the key context and merge it with any provided notes or transcripts.
        `;

    console.log('[Backend - Gemini API] Preparing Multimodal Request (Audio Optional)...');

    const parts = [{ text: prompt }];

    // Add images if any
    if (imageUrls && imageUrls.length > 0) {
      console.log(`[Backend - Gemini API] Processing ${imageUrls.length} images...`);
      for (const url of imageUrls) {
        const imagePart = await urlToGenerativePart(url);
        if (imagePart) {
          parts.push(imagePart);
        }
      }
    }

    console.log('[Backend - Gemini API] Final Prompt Parts Count:', parts.length);
    // Log the prompt for debugging as requested
    console.log('[Backend - Gemini API] Sent Combined Prompt Logic to Gemini.');

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    console.log('[Backend - Gemini API] Summary generated successfully.');
    return text;

  } catch (error) {
    console.error(`[Backend - Gemini API] CRITICAL ERROR: ${error.message}`);
    if (error.stack) console.error(error.stack);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

module.exports = { generateSummary };
