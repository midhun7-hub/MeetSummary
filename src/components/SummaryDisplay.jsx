import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryDisplay = ({ meeting }) => {
    if (!meeting) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(meeting.summary);
        // Could add a toast notification here
    };

    const downloadSummary = () => {
        const element = document.createElement("a");
        const file = new Blob([meeting.summary], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${meeting.title || 'summary'}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 w-full max-w-4xl mx-auto"
        >
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        {meeting.title || "Meeting Summary"}
                    </h2>
                    <span className="text-gray-400 text-sm">
                        {new Date(meeting.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button onClick={copyToClipboard} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Copy">
                        <Copy className="w-5 h-5" />
                    </button>
                    <button onClick={downloadSummary} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Download">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{meeting.summary}</ReactMarkdown>
            </div>

            {meeting.imageUrls && meeting.imageUrls.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Attached Visuals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {meeting.imageUrls.map((url, index) => (
                            <div key={index} className="rounded-lg overflow-hidden border border-white/10 aspect-video">
                                <img src={url} alt={`Meeting Visual ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {meeting.transcript && (
                <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Transcript</h3>
                    <div className="bg-dark/50 p-4 rounded-lg text-gray-400 text-sm max-h-60 overflow-y-auto whitespace-pre-wrap">
                        {meeting.transcript}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SummaryDisplay;
