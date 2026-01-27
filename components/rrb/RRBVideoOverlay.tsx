"use client";

import { useState } from "react";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

interface RRBVideoOverlayProps {
    videoId: string; // YouTube ID
    isVisible: boolean;
    onClose: () => void;
}

export function RRBVideoOverlay({ videoId, isVisible, onClose }: RRBVideoOverlayProps) {
    const [isMinimized, setIsMinimized] = useState(false);

    // If we don't have a specific ID, let's just use a search query embed or a generic educational video
    // Constructing embed source. 
    // Privacy-enhanced mode: https://www.youtube-nocookie.com/embed/VIDEO_ID
    const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        width: isMinimized ? "320px" : "100%",
                        height: isMinimized ? "auto" : "100%",
                        position: isMinimized ? "fixed" : "fixed",
                        bottom: isMinimized ? "24px" : "0",
                        right: isMinimized ? "24px" : "0",
                        top: isMinimized ? "auto" : "0",
                        left: isMinimized ? "auto" : "0",
                        zIndex: 50
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={isMinimized ? "" : "bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"}
                >
                    <GlassCard className={`relative flex flex-col overflow-hidden ${isMinimized ? "shadow-2xl border-white/20" : "w-full max-w-5xl aspect-video border-white/10"}`}>
                        {/* Header controls */}
                        <div className="absolute top-0 left-0 right-0 p-2 flex justify-end gap-2 bg-gradient-to-b from-black/80 to-transparent z-10">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className={`w-full ${isMinimized ? "aspect-video" : "h-full"}`}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={src}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </GlassCard>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
