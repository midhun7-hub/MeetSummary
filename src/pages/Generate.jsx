import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AudioRecorder from '../components/AudioRecorder';
import SummaryDisplay from '../components/SummaryDisplay';
import axios from 'axios';
import { Loader2, FileText, Sparkles } from 'lucide-react';

const Dashboard = () => {
    // State for Transcript Flow
    const [transcript, setTranscript] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);

    // State for captured inputs (before summarization)
    const [capturedNotes, setCapturedNotes] = useState('');
    const [capturedImages, setCapturedImages] = useState([]);
    const [isReadyForSummary, setIsReadyForSummary] = useState(false);

    // State for Summary Flow
    const [meetingData, setMeetingData] = useState(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    const [error, setError] = useState(null);

    // Helper to get token
    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.token;
    };

    // Step 1: Handle Initial Processing (Transcription + Input Capture)
    const handleInitialProcess = async (audioBlob, notes, images) => {
        setError(null);
        setMeetingData(null);
        setTranscript('');
        setCapturedNotes(notes);
        setCapturedImages(images);
        setIsReadyForSummary(false);

        if (audioBlob) {
            setIsTranscribing(true);
            try {
                const audioFormData = new FormData();
                const filename = audioBlob.name || 'recording.webm';
                audioFormData.append('audio', audioBlob, filename);

                const transResponse = await axios.post('http://localhost:5001/api/meetings/transcribe', audioFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${getToken()}`
                    },
                });
                setTranscript(transResponse.data.transcript);
                setIsReadyForSummary(true);
            } catch (err) {
                console.error("Transcription Error:", err);
                setError("Failed to transcribe audio. You can still generate summary from notes/files.");
                setIsReadyForSummary(true); // Allow proceeding even if transcription fails
            } finally {
                setIsTranscribing(false);
            }
        } else {
            setIsReadyForSummary(true);
        }
    };

    // Step 2: Handle Final Summarization (Triggers Gemini)
    const handleGenerateSummary = async () => {
        if (!transcript && !capturedNotes && capturedImages.length === 0) {
            setError("No content to summarize. Please provide a transcript, notes, or files.");
            return;
        }

        setIsSummarizing(true);
        setError(null);

        try {
            const sumFormData = new FormData();
            sumFormData.append('transcript', transcript);
            sumFormData.append('userNotes', capturedNotes);

            capturedImages.forEach((file) => {
                sumFormData.append('images', file);
            });

            const sumResponse = await axios.post('http://localhost:5001/api/meetings/summarize', sumFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            setMeetingData(sumResponse.data);
            setIsReadyForSummary(false); // Move to final display

        } catch (err) {
            console.error("Summarization Error:", err);
            setError("Failed to generate summary. Please try again.");
        } finally {
            setIsSummarizing(false);
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

                {/* Recorder / Upload Section (Only show if not summarized) */}
                {!meetingData && !isReadyForSummary && (
                    <AudioRecorder
                        onUploadComplete={handleInitialProcess}
                        isProcessing={isTranscribing}
                    />
                )}

                {/* Review transcript / Proceed to summary UI */}
                {isReadyForSummary && !isSummarizing && (
                    <div className="max-w-2xl mx-auto mb-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="glass-panel p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Review Inputs
                            </h2>

                            {transcript && (
                                <div className="mb-4">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Transcript</label>
                                    <div className="bg-dark/50 p-4 rounded-lg text-sm text-gray-300 max-h-40 overflow-y-auto">
                                        {transcript}
                                    </div>
                                </div>
                            )}

                            {capturedNotes && (
                                <div className="mb-4">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Notes</label>
                                    <div className="bg-dark/50 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
                                        {capturedNotes}
                                    </div>
                                </div>
                            )}

                            {capturedImages.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                                        {capturedImages.length} Files Attached
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => { setIsReadyForSummary(false); setTranscript(''); }}
                                    className="btn-secondary flex-1 py-3"
                                >
                                    Cancel & Restart
                                </button>
                                <button
                                    onClick={handleGenerateSummary}
                                    className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Generate Final Summary
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-center">
                        {error}
                    </div>
                )}

                {/* Status Indicator */}
                {(isTranscribing || isSummarizing) && (
                    <div className="max-w-2xl mx-auto mb-8 text-center animate-pulse text-primary flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isTranscribing ? 'Converting Audio to Text...' : 'Gemini is craftsmanship your summary...'}</span>
                    </div>
                )}

                {/* Results Section */}
                {meetingData && !isSummarizing && (
                    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SummaryDisplay meeting={meetingData} />
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => { setMeetingData(null); setIsReadyForSummary(false); setTranscript(''); }}
                                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                Start New Meeting
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
