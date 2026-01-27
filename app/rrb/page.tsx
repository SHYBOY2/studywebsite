"use client";

import { useState } from "react";
import { RRBSidebar } from "@/components/rrb/RRBSidebar";
import { RRBWorkspace } from "@/components/rrb/RRBWorkspace";
import { RRBVideoOverlay } from "@/components/rrb/RRBVideoOverlay";
import { RRB_DATA, RRBModule } from "@/data/rrb";
import { GlassCard } from "@/components/ui/GlassCard";

export default function RRBPage() {
    const [activeModule, setActiveModule] = useState<RRBModule>(RRB_DATA[0].modules[0]);
    const [showVideo, setShowVideo] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true); // Toggle for mobile if needed

    return (
        <div className="h-[calc(100vh-theme(spacing.8))] flex flex-col md:flex-row gap-4 overflow-hidden">
            {/* Sidebar - Desktop: Fixed width, Mobile: Hidden/Slide-over */}
            <GlassCard className="w-full md:w-80 flex-shrink-0 flex flex-col p-0 overflow-hidden border-yellow-500/10">
                <RRBSidebar
                    activeModule={activeModule}
                    onSelectModule={(mod) => {
                        setActiveModule(mod);
                        // Auto-open video suggestion? Maybe not, too intrusive.
                    }}
                />
            </GlassCard>

            {/* Main Workspace */}
            <GlassCard className="flex-1 p-0 overflow-hidden relative border-blue-500/10">
                <RRBWorkspace
                    activeModule={activeModule}
                    onAskGemini={() => {
                        // Feature: Open a specific chat mode or context
                        console.log("Gemini Context Activated");
                    }}
                />

                {/* Floating Action Button for Video if closed? */}
                {!showVideo && (
                    <button
                        onClick={() => setShowVideo(true)}
                        className="absolute bottom-6 right-6 p-4 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/30 hover:scale-110 transition-transform z-10 flex items-center gap-2"
                    >
                        <span className="text-xs font-bold">Watch Lesson</span>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                )}
            </GlassCard>

            {/* Video Overlay */}
            <RRBVideoOverlay
                videoId={activeModule.youtubeId || "1Z6iP6_hCOs"}
                isVisible={showVideo}
                onClose={() => setShowVideo(false)}
            />
        </div>
    );
}
