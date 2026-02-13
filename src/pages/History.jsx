import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SummaryDisplay from '../components/SummaryDisplay';
import axios from 'axios';
import { Loader2, Calendar, FileAudio } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    useEffect(() => {
        const fetchMeetings = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            if (!token) return;

            try {
                const response = await axios.get('http://localhost:5001/api/meetings', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMeetings(response.data);
            } catch (error) {
                console.error("Error fetching meetings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    return (
        <div className="min-h-screen bg-darker text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Meeting History</h1>
                    <p className="text-gray-400">Your archive of past conversations</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar / List */}
                    <div className="lg:col-span-1 space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : meetings.length === 0 ? (
                            <div className="text-gray-500 text-center p-8 glass-panel">
                                No meetings found.
                            </div>
                        ) : (
                            meetings.map((meeting) => (
                                <motion.div
                                    key={meeting._id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedMeeting(meeting)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedMeeting?._id === meeting._id
                                        ? 'bg-primary/20 border-primary/50'
                                        : 'glass-panel border-white/5 hover:bg-white/5'
                                        }`}
                                >
                                    <h3 className="font-semibold truncate">{meeting.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(meeting.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Content View */}
                    <div className="lg:col-span-2">
                        {selectedMeeting ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <SummaryDisplay meeting={selectedMeeting} />
                            </motion.div>
                        ) : (
                            <div className="glass-panel h-96 flex flex-col items-center justify-center text-gray-500">
                                <FileAudio className="w-12 h-12 mb-4 opacity-50" />
                                <p>Select a meeting to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default History;
