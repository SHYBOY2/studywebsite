"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw } from "lucide-react";

interface Job {
    id: string;
    title: string;
    link: string;
}

export function JobTicker() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/jobs");
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 3600000); // Check every hour
        return () => clearInterval(interval);
    }, []);

    return (
        <GlassCard className="h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Live Job Tracker
                </h2>
                <button
                    onClick={fetchJobs}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Refresh Jobs"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Searching for updates...</div>
                ) : error ? (
                    <div className="text-center text-red-400 py-10">Failed to load updates.</div>
                ) : jobs.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No updates found.</div>
                ) : (
                    jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                        >
                            <a
                                href={job.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-between items-start gap-2"
                            >
                                <span className="text-sm font-medium text-gray-200 group-hover:text-blue-300 transition-colors line-clamp-2">
                                    {job.title}
                                </span>
                                <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </motion.div>
                    ))
                )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1e293b] to-transparent pointer-events-none" />
        </GlassCard>
    );
}
