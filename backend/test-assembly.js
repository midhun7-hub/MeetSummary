const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const testAssemblyAI = async () => {
    const API_KEY = (process.env.ASSEMBLYAI_API_KEY || '').trim();
    console.log('Testing AssemblyAI with Key:', API_KEY ? `...${API_KEY.slice(-4)}` : 'MISSING');

    if (!API_KEY) return;

    try {
        console.log('1. Testing connectivity to api.assemblyai.com...');
        const response = await axios.get('https://api.assemblyai.com/v2/transcript', {
            headers: { authorization: API_KEY }
        });
        console.log('SUCCESS: Connected to AssemblyAI! (Found transcripts)');
    } catch (err) {
        console.error('FAILED: AssemblyAI Error:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
};

testAssemblyAI();
