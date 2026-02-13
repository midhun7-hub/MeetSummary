import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AudioRecorder from '../components/AudioRecorder';
import SummaryDisplay from '../components/SummaryDisplay';
import axios from 'axios';
import { Loader2, FileText, Sparkles } from 'lucide-react';

const Dashboard = () => {
    // State for Transcript Flow
    const [transcript, setTranscript] = useState(null);
    const [isTranscribing, setIsTranscribing] = useState(false);

    // State for Summary Flow
    const [meetingData, setMeetingData] = useState(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    const [error, setError] = useState(null);

    // Helper to get token
    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.token;
    };

    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };

    // State for Multimodal Data (these are now managed by the AudioRecorder component and passed directly)
    // const [userNotes, setUserNotes] = useState('');
    // const [selectedImages, setSelectedImages] = useState([]);

    // RE-WRITING handleUploadComplete and handleGenerateSummary

    const handleProcessAll = async (audioBlob, notes, images) => {
        setIsTranscribing(!!audioBlob); // Set transcribing true only if audioBlob exists
        setIsSummarizing(true); // Summarizing starts immediately after (or in parallel with) transcription
        setError(null);
        setMeetingData(null);
        setTranscript('');

        let currentTranscript = '';

        try {
            // 1. Transcribe if audio present
            if (audioBlob) {
                const audioFormData = new FormData();
                const filename = audioBlob.name || 'recording.webm';
                audioFormData.append('audio', audioBlob, filename);

                const transResponse = await axios.post('http://localhost:5001/api/meetings/transcribe', audioFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${getToken()}`
                    },
                });
                currentTranscript = transResponse.data.transcript;
                setTranscript(currentTranscript);
                setIsTranscribing(false); // Transcription finished
            } else {
                setIsTranscribing(false); // No audio, so no transcription
            }

            // 2. Transcribe done (or skipped). Now summarize.
            const sumFormData = new FormData();
            sumFormData.append('transcript', currentTranscript);
            sumFormData.append('userNotes', notes);

            images.forEach((file) => {
                sumFormData.append('images', file);
            });

            const sumResponse = await axios.post('http://localhost:5001/api/meetings/summarize', sumFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            setMeetingData(sumResponse.data);

        } catch (err) {
            console.error("DEBUG ERROR - Full Process Error Object:", err);
            if (err.response) {
                console.error("DEBUG ERROR - Server Response Data:", err.response.data);
                console.error("DEBUG ERROR - Server Status:", err.response.status);
            }
            setError("Failed to generate summary. Please check your connection and try again.");
        } finally {
            setIsTranscribing(false); // Ensure this is false even if an error occurred during transcription
            setIsSummarizing(false); // Ensure this is false even if an error occurred during summarization
        }
    };

    return (
        <div className="min-h-screen bg-darker text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-10">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
                        Turn Conversations into Action
                    </h1>
                </header>

                {/* Recorder / Upload Section */}
                <AudioRecorder
                    onUploadComplete={handleProcessAll}
                    isProcessing={isTranscribing || isSummarizing}
                />

                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-center">
                        {error}
                    </div>
                )}

                {/* Status Indicator */}
                {(isTranscribing || isSummarizing) && (
                    <div className="max-w-2xl mx-auto mb-8 text-center animate-pulse text-primary flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isTranscribing ? 'Converting Audio to Text...' : 'Gemini is analyzing your meeting...'}</span>
                    </div>
                )}

                {/* Results Section */}
                {meetingData && !isSummarizing && (
                    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SummaryDisplay meeting={meetingData} />
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
