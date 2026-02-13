const axios = require('axios');
const fs = require('fs');

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_URL = 'https://api.assemblyai.com/v2';

const headers = {
    authorization: ASSEMBLYAI_API_KEY,
};

/**
 * Uploads audio file to AssemblyAI
 * @param {string} filePath - Path to the audio file
 * @returns {Promise<string>} - The upload URL
 */
const uploadAudio = async (filePath) => {
    try {
        console.log(`[Backend - AssemblyAI] Uploading file: ${filePath}`);
        const audioData = fs.readFileSync(filePath);

        const response = await axios.post(`${ASSEMBLYAI_URL}/upload`, audioData, {
            headers: headers
        });

        console.log(`[Backend - AssemblyAI] Upload complete. URL: ${response.data.upload_url}`);
        return response.data.upload_url;
    } catch (error) {
        console.error(`[Backend - AssemblyAI] Upload Error: ${error.message}`);
        throw error;
    }
};

/**
 * Transcribes audio from an upload URL
 * @param {string} audioUrl - The URL of the uploaded audio
 * @returns {Promise<string>} - The transcription text
 */
const transcribeAudio = async (audioUrl) => {
    try {
        console.log('[Backend - AssemblyAI] Starting transcription...');

        // 1. Submit transcription request
        const response = await axios.post(`${ASSEMBLYAI_URL}/transcript`, {
            audio_url: audioUrl,
            language_detection: true, // As requested in snippet
            speech_models: ["universal-3-pro", "universal-2"] // As requested in snippet
        }, { headers });

        const transcriptId = response.data.id;
        console.log(`[Backend - AssemblyAI] Transcription started. ID: ${transcriptId}`);

        // 2. Poll for results
        const pollingEndpoint = `${ASSEMBLYAI_URL}/transcript/${transcriptId}`;

        while (true) {
            const pollingResponse = await axios.get(pollingEndpoint, { headers });
            const transcriptionResult = pollingResponse.data;

            if (transcriptionResult.status === 'completed') {
                console.log('[Backend - AssemblyAI] Transcription completed.');
                return transcriptionResult.text;
            } else if (transcriptionResult.status === 'error') {
                throw new Error(`Transcription failed: ${transcriptionResult.error}`);
            } else {
                console.log(`[Backend - AssemblyAI] Status: ${transcriptionResult.status}... waiting 3s`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    } catch (error) {
        console.error(`[Backend - AssemblyAI] Transcription Error: ${error.message}`);
        throw error;
    }
};

module.exports = { uploadAudio, transcribeAudio };
