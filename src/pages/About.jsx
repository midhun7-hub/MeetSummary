import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Database, FileText, Image, Mic, StickyNote } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Mic className="w-6 h-6 text-yellow-400" />,
            title: "Audio Transcription",
            desc: "Powered by AssemblyAI, we convert your meeting recordings to text with high accuracy in seconds."
        },
        {
            icon: <Image className="w-6 h-6 text-pink-400" />,
            title: "Image & PDF OCR",
            desc: "Upload whiteboard photos, slides, or PDF documents. Our AI extracts and analyzes the content automatically."
        },
        {
            icon: <StickyNote className="w-6 h-6 text-green-400" />,
            title: "Manual Notes",
            desc: "Add your own notes alongside audio and images. Everything gets combined into one comprehensive summary."
        },
        {
            icon: <Cpu className="w-6 h-6 text-blue-400" />,
            title: "Multimodal AI Summarization",
            desc: "Google Gemini analyzes audio transcripts, notes, images, and PDFs together to create structured summaries with action items."
        },
        {
            icon: <Database className="w-6 h-6 text-purple-400" />,
            title: "Secure Storage",
            desc: "Your data is safely stored in MongoDB with user authentication, ensuring you can access your history anytime."
        },
        {
            icon: <Shield className="w-6 h-6 text-indigo-400" />,
            title: "Private & Safe",
            desc: "We prioritize your privacy with JWT authentication, secure file handling, and encrypted data transmission."
        }
    ];

    return (
        <div className="min-h-screen bg-darker text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl font-bold mb-6 text-center">About MeetSummary</h1>
                    <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        MeetSummary is a multimodal AI assistant that transforms your meetings into actionable insights by combining audio, images, PDFs, and notes.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel p-6 border border-white/5"
                            >
                                <div className="w-12 h-12 rounded-lg bg-dark/50 flex items-center justify-center mb-4 border border-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 glass-panel rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                        <h2 className="text-2xl font-bold mb-4">How it Works</h2>
                        <ol className="list-decimal list-inside space-y-4 text-gray-300">
                            <li><strong>Record or Upload Audio</strong>: Use the built-in recorder or upload an existing audio file (optional).</li>
                            <li><strong>Add Notes & Files</strong>: Type manual notes and drag-and-drop images, whiteboards, or PDF documents.</li>
                            <li><strong>Transcribe</strong>: Our speech-to-text engine converts audio into a verbatim transcript.</li>
                            <li><strong>Multimodal Analysis</strong>: Gemini AI analyzes all inputs together—transcript, notes, images, and PDFs.</li>
                            <li><strong>Generate Summary</strong>: Get a structured summary with executive overview, key discussion points, and action items.</li>
                            <li><strong>Archive & Access</strong>: Everything is saved to your history with searchable titles for future reference.</li>
                        </ol>
                    </div>

                    <div className="mt-8 p-6 glass-panel rounded-2xl bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/20">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-green-400" />
                            Flexible Input Options
                        </h2>
                        <p className="text-gray-300 mb-3">
                            MeetSummary works with any combination of inputs:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-400">
                            <li>Audio only (traditional meeting recording)</li>
                            <li>Notes only (quick text summaries)</li>
                            <li>Images/PDFs only (analyze documents or whiteboards)</li>
                            <li>Audio + Notes (enhanced context)</li>
                            <li>Audio + Images (capture visual aids)</li>
                            <li>All combined (complete multimodal analysis)</li>
                        </ul>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default About;
