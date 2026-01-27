"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlaylistCard } from "@/components/video-vault/PlaylistCard";
import { PLAYLISTS, ExamCategory, SubjectCategory } from "@/data/playlists";
import { Youtube, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VideoVaultPage() {
    const [selectedExam, setSelectedExam] = useState<ExamCategory | "All">("All");
    const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | "All">("All");

    const filteredPlaylists = PLAYLISTS.filter(p => {
        const examMatch = selectedExam === "All" || p.exam === selectedExam;
        const subjectMatch = selectedSubject === "All" || p.subject === selectedSubject;
        return examMatch && subjectMatch;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-3">
                        <Youtube className="w-8 h-8 text-red-500" /> Exam Video Vault
                    </h1>
                    <p className="text-gray-400 mt-1">Curated high-yield playlists for RRB, SSC, and Banking.</p>
                </div>

                {/* Filters */}
                <GlassCard className="flex items-center gap-4 py-2 px-4">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-2">
                        {(["All", "RRB", "SSC", "Banking"] as const).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedExam(cat)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-medium transition-colors border",
                                    selectedExam === cat
                                        ? "bg-red-600 border-red-500 text-white"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {filteredPlaylists.map((playlist, idx) => (
                    <PlaylistCard key={idx} playlist={playlist} />
                ))}

                {filteredPlaylists.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500">
                        <Search className="w-12 h-12 mb-2 opacity-20" />
                        <p>No playlists found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
