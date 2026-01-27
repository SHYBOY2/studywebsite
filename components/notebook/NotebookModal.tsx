"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, AlertTriangle, RefreshCw, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotebookModalProps {
    isOpen: boolean;
    onClose: () => void;
    notebookId?: string;
    initialQuery?: string;
}

export function NotebookModal({ isOpen, onClose, notebookId = "YOUR_NOTEBOOK_ID", initialQuery }: NotebookModalProps) {
    const [url, setUrl] = useState(`https://notebooklm.google.com/notebook/${notebookId}`);
    const [customInput, setCustomInput] = useState("");

    const handleUpdateUrl = () => {
        if (customInput.includes('notebooklm.google.com')) {
            setUrl(customInput);
        } else {
            // Assume it's just an ID
            setUrl(`https://notebooklm.google.com/notebook/${customInput}`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="w-full max-w-6xl h-[85vh] relative"
                    >
                        <GlassCard className="w-full h-full p-0 flex flex-col border-yellow-500/20 shadow-2xl overflow-hidden bg-[#1e1e1e]">
                            {/* Header */}
                            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1a1a] gap-4">
                                <div className="flex items-center gap-3 min-w-fit">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <img src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif" alt="Gemini" className="w-5 h-5 opacity-80" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-100">Research Mode</h3>
                                        <p className="text-xs text-gray-400">NotebookLM Integration</p>
                                    </div>
                                </div>

                                {/* URL Config Bar */}
                                <div className="flex-1 max-w-xl flex items-center gap-2 bg-black/30 rounded-lg p-1 border border-white/5">
                                    <input
                                        type="text"
                                        placeholder="Paste your Notebook URL or ID here..."
                                        className="flex-1 bg-transparent border-none text-xs text-gray-300 px-3 focus:outline-none"
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateUrl()}
                                    />
                                    <button
                                        onClick={handleUpdateUrl}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs font-medium text-gray-300 transition-colors"
                                    >
                                        Load
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-md text-xs font-medium transition-colors border border-blue-500/20"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Open in New Tab
                                    </a>
                                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Iframe Content */}
                            <div className="flex-1 relative bg-white group">
                                <iframe
                                    src={url}
                                    className="w-full h-full"
                                    title="Google NotebookLM"
                                    allow="clipboard-write; microphone"
                                />

                                {/* Helper Overlay (Always available on hover or if empty) */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl text-center border border-white/10 pointer-events-auto">
                                        <p className="text-gray-200 mb-2 font-medium">Seeing an error?</p>
                                        <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
                                            Google often blocks direct embedding (403/Refused).
                                            <br />Use the button above to open in a new tab.
                                        </p>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white text-sm font-medium hover:bg-blue-500 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Launch External
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
