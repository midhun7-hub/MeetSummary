const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const testGemini = async () => {
    try {
        const API_KEY = (process.env.GEMINI_API_KEY || '').trim();
        if (!API_KEY) {
            console.error('ERROR: GEMINI_API_KEY not found in .env');
            return;
        }

        console.log(`Using API Key starting with: ${API_KEY.substring(0, 4)}...`);
        const genAI = new GoogleGenerativeAI(API_KEY);

        const models = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"];

        for (const m of models) {
            console.log(`--- Testing model: ${m} ---`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hello?");
                const response = await result.response;
                console.log(`SUCCESS: ${m} working. Response:`, response.text());
            } catch (err) {
                console.error(`FAILED: ${m} error:`, err.message);
                if (err.response) {
                    console.error(`Status: ${err.response.status}`);
                    console.error(`Data:`, JSON.stringify(err.response.data, null, 2));
                }
            }
        }
    } catch (error) {
        console.error('CRITICAL FAILED:', error.message);
    }
};

testGemini();
