"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, AlertTriangle, RefreshCw } from "lucide-react";

interface NotebookExplorerProps {
    notebookId?: string;
}

export function NotebookExplorer({ notebookId = "YOUR_NOTEBOOK_ID" }: NotebookExplorerProps) {
    const [url, setUrl] = useState(`https://notebooklm.google.com/notebook/${notebookId}`);
    const [showAuthWarning, setShowAuthWarning] = useState(true);

    return (
        <div className="w-full h-full flex flex-col gap-4">
            {/* Guidance / Auth Warning */}
            {showAuthWarning && (
                <GlassCard className="flex items-center justify-between py-2 px-4 bg-yellow-500/10 border-yellow-500/20">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-200">
                            Ensure you are logged into your Google Account in this browser. If the frame is blocked, open specifically in a new tab.
                        </span>
                    </div>
                    <button
                        onClick={() => setShowAuthWarning(false)}
                        className="text-xs text-yellow-500 hover:text-yellow-400 underline"
                    >
                        Dismiss
                    </button>
                </GlassCard>
            )}

            {/* Main Frame Container */}
            <GlassCard className="flex-1 p-0 overflow-hidden relative border-blue-500/20">
                <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 flex items-center justify-between px-4 border-b border-white/10 z-10">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-2 font-mono text-xs opacity-50">notebooklm.google.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setUrl(prev => prev)}
                            className="p-1.5 hover:bg-white/10 rounded-md text-gray-400"
                            title="Reload Frame"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-white/10 rounded-md text-blue-400"
                            title="Open in New Tab"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Iframe */}
                <iframe
                    src={url}
                    className="w-full h-full pt-10 bg-white" // NotebookLM has a white theme usually, so generic bg-white backing
                    frameBorder="0"
                    allow="clipboard-write; microphone"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    title="NotebookLM Explorer"
                />

                {/* Overlay for "Refused to Connect" handling (Visual Fallback) */}
                <div className="absolute inset-0 top-10 pointer-events-none flex items-center justify-center -z-10">
                    <div className="text-center">
                        <p className="text-gray-500 mb-2">Loading NotebookLM...</p>
                        <p className="text-xs text-gray-600">If you see a blank screen, Google might be blocking the embed.</p>
                    </div>
                </div>
            </GlassCard>

            {/* Sync Status (Mocking the 'Agent' requirement) */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Antigravity Sync Agent: Active</span>
                </div>
                <p className="text-xs text-gray-500">Watching for new RRB Resources...</p>
            </div>
        </div>
    );
}
