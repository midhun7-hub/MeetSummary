const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const listModels = async () => {
    try {
        const API_KEY = (process.env.GEMINI_API_KEY || '').trim();
        if (!API_KEY) {
            console.error('ERROR: GEMINI_API_KEY not found in .env');
            return;
        }

        const genAI = new GoogleGenerativeAI(API_KEY);

        // Use the listModels method on the genAI instance if available, 
        // or check the documentation for how to list via SDK.
        // Actually, listing models usually requires a different client or direct API call.
        // Let's try the direct API call via axios to be sure.
        const axios = require('axios');
        console.log('Fetching model list via direct API call...');
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);

        console.log('Available Models:');
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
        });

    } catch (error) {
        console.error('FAILED to list models:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

listModels();
