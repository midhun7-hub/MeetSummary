import React, { useState, useRef } from 'react';
import { Mic, Square, Upload, Loader2, FileAudio, FileText, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageUpload from './ImageUpload';

const AudioRecorder = ({ onUploadComplete, isProcessing }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [userNotes, setUserNotes] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Timer
            let seconds = 0;
            timerRef.current = setInterval(() => {
                seconds++;
                setRecordingDuration(seconds);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure you have granted permission.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setRecordingDuration(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioBlob(file);
        }
    };

    const handleProcess = () => {
        if (audioBlob || userNotes.trim() || selectedImages.length > 0) {
            // Pass audio, notes, and images back
            onUploadComplete(audioBlob, userNotes, selectedImages);
        }
    };

    return (
        <div className="glass-panel p-6 w-full max-w-2xl mx-auto mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                Capture Meeting
            </h2>

            <div className="flex flex-col space-y-8">
                {/* Audio Section */}
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-full h-32 bg-dark/50 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden">
                        {isRecording && (
                            <div className="absolute inset-0 flex items-center justify-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-primary/60 rounded-full h-4"
                                        animate={{ height: ["10%", "60%", "10%"] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                    />
                                ))}
                            </div>
                        )}

                        {!isRecording && !audioBlob && (
                            <span className="text-gray-500 text-sm">Ready to record or upload audio</span>
                        )}

                        {audioBlob && (
                            <div className="flex items-center gap-3 text-secondary">
                                <FileAudio className="w-8 h-8" />
                                <span className="font-medium">Audio Captured</span>
                            </div>
                        )}
                    </div>

                    {isRecording && (
                        <div className="text-3xl font-mono font-bold text-white tracking-wider">
                            {formatTime(recordingDuration)}
                        </div>
                    )}

                    <div className="flex gap-4">
                        {!isRecording && !audioBlob && (
                            <>
                                <button onClick={startRecording} className="btn-primary flex items-center gap-2">
                                    <Mic className="w-4 h-4" /> Start Recording
                                </button>
                                <button onClick={() => fileInputRef.current.click()} className="btn-secondary flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Upload Audio
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="audio/*"
                                    className="hidden"
                                />
                            </>
                        )}

                        {isRecording && (
                            <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center gap-2 animate-pulse">
                                <Square className="w-4 h-4" /> Stop Recording
                            </button>
                        )}

                        {audioBlob && !isProcessing && (
                            <button onClick={resetRecording} className="text-gray-400 hover:text-white px-4 py-2 transition-colors">
                                Discard Audio
                            </button>
                        )}
                    </div>
                </div>

                {/* Notes and Images Section */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                    {/* User Notes */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                            <FileText className="w-4 h-4" /> Manual Notes (Optional)
                        </label>
                        <textarea
                            value={userNotes}
                            onChange={(e) => setUserNotes(e.target.value)}
                            className="w-full h-24 bg-dark/30 border border-white/10 rounded-lg p-3 text-white focus:border-primary/50 outline-none transition-all resize-none"
                            placeholder="Type meeting highlights, key decisions, or context..."
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                            <ImageIcon className="w-4 h-4" /> Supporting Materials (Photos, PDFs)
                        </label>
                        <ImageUpload onImagesChange={setSelectedImages} />
                    </div>

                    {/* Final Action */}
                    <div className="flex justify-center pt-4">
                        {!isProcessing ? (
                            <button
                                onClick={handleProcess}
                                disabled={!audioBlob && !userNotes.trim() && selectedImages.length === 0}
                                className="btn-primary flex items-center gap-2 w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>
                                    {(() => {
                                        const hasAudio = !!audioBlob;
                                        const hasNotes = userNotes.trim().length > 0;
                                        const hasFiles = selectedImages.length > 0;

                                        if (hasAudio && !hasNotes && !hasFiles) return "Generate Summary with Audio";
                                        if (!hasAudio && hasNotes && !hasFiles) return "Generate Summary with Notes";
                                        if (!hasAudio && !hasNotes && hasFiles) return `Generate with ${selectedImages.length === 1 ? 'Photo' : 'Photos/PDFs'}`;
                                        if (hasAudio && (hasNotes || hasFiles)) return "Generate Multimodal Summary";
                                        if (hasNotes && hasFiles) return "Generate with Notes & Files";
                                        return "Generate Summary";
                                    })()}
                                </span>
                            </button>
                        ) : (
                            <button disabled className="btn-secondary flex items-center gap-2 cursor-wait w-full py-3">
                                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Inputs...
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioRecorder;
