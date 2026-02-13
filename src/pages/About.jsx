import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Database } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: "Instant Transcription",
            desc: "Powered by AssemblyAI, we convert your audio to text with high accuracy in seconds."
        },
        {
            icon: <Cpu className="w-6 h-6 text-blue-400" />,
            title: "AI Summarization",
            desc: "Google Gemini 1.5 Pro analyzes the transcript to extract key points, action items, and executive summaries."
        },
        {
            icon: <Database className="w-6 h-6 text-green-400" />,
            title: "Secure Storage",
            desc: "Your data is safely stored in MongoDB, ensuring you can access your history anytime."
        },
        {
            icon: <Shield className="w-6 h-6 text-purple-400" />,
            title: "Private & Safe",
            desc: "We prioritize your privacy with secure authentication and data handling practices."
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
                        MeetSummary is designed to make your meetings more productive by handling the note-taking for you.
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
                            <li><strong>Record or Upload</strong>: Use the built-in recorder or upload an existing audio file.</li>
                            <li><strong>Transcribe</strong>: Our speech-to-text engine converts audio into a verbatim transcript.</li>
                            <li><strong>Summarize</strong>: The AI analyzes the text to identify the most important information.</li>
                            <li><strong>Archive</strong>: Everything is saved to your history for future reference.</li>
                        </ol>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default About;
