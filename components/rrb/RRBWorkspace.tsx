"use client";

import { RRBModule } from "@/data/rrb";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, FileText, Youtube, MessageSquare, RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NotebookModal } from "@/components/notebook/NotebookModal";

interface RRBWorkspaceProps {
    activeModule: RRBModule;
    onAskGemini: () => void;
}

export function RRBWorkspace({ activeModule, onAskGemini }: RRBWorkspaceProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: `Hello! I've loaded the ${activeModule.title} module. Ask me anything about the syllabus or PDF content.` }
    ]);
    const [input, setInput] = useState("");
    const [isNotebookOpen, setIsNotebookOpen] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput("");

        // Mock Response simulating Agent connection
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: `[Notebook Agent]: I've checked your NotebookLM for '${activeModule.title}'. Ensure you've imported the official PDF. I can summarize it once connected.` }]);
        }, 1200);
    };

    const handleSync = () => {
        // In a real agent scenario, this would trigger the agent to performing the "Add Source" action.
        setMessages(prev => [...prev, { role: 'ai', text: `🔄 Syncing '${activeModule.title}' PDF to NotebookLM... (Agent would now add source: ${activeModule.pdfLink})` }]);
        setTimeout(() => setIsNotebookOpen(true), 1500); // Open notebook after 'sync'
    };

    return (
        <div className="flex-1 h-full flex flex-col gap-6 p-4 md:p-6 overflow-y-auto relative">
            <NotebookModal
                isOpen={isNotebookOpen}
                onClose={() => setIsNotebookOpen(false)}
                initialQuery={activeModule.title}
            />

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{activeModule.title}</h1>
                    <p className="text-gray-400">{activeModule.description}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSync}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-medium hover:bg-white/10 transition-colors"
                        title="Add PDF to NotebookLM"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden md:inline">Sync to Notebook</span>
                    </button>
                    <button
                        onClick={() => setIsNotebookOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:scale-105 transition-transform shadow-lg shadow-blue-500/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        Research Mode
                    </button>
                </div>
            </div>

            {/* AI Summary Card */}
            <GlassCard className="bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border-yellow-500/20">
                <div className="flex items-center gap-2 mb-3 text-yellow-400">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="font-semibold text-sm uppercase tracking-wider">AI Summary</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                    {activeModule.summary}
                </p>
            </GlassCard>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PDF Resource */}
                <a href={activeModule.pdfLink} target="_blank" rel="noopener noreferrer" className="block group">
                    <GlassCard className="h-full hover:bg-white/10 transition-colors flex items-center gap-4 cursor-pointer">
                        <div className="p-3 rounded-lg bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200">Official Study PDF</h4>
                            <p className="text-xs text-gray-400 mt-1">Click to open external resource</p>
                        </div>
                    </GlassCard>
                </a>

                {/* Video Resource Placeholder (Trigger for overlay usually, but here distinct card) */}
                <div className="block cursor-pointer group">
                    <GlassCard className="h-full hover:bg-white/10 transition-colors flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-red-600/20 text-red-500 group-hover:scale-110 transition-transform">
                            <Youtube className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200">Curated Video Lesson</h4>
                            <p className="text-xs text-gray-400 mt-1">Matches: "{activeModule.videoQuery}"</p>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Chat Interface (NotebookLM Style) */}
            <GlassCard className="flex-1 flex flex-col min-h-[300px] border-blue-500/30">
                <div className="p-3 border-b border-white/10 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Chat with this module</span>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 flex-shrink-0"><Sparkles className="w-4 h-4" /></div>}
                            <div className={cn(
                                "max-w-[80%] p-3 rounded-2xl text-sm",
                                msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/10 text-gray-200 rounded-tl-none"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t border-white/10">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question about this topic..."
                            className="w-full bg-black/20 border border-white/10 rounded-full py-2 px-4 pr-10 text-sm md:text-base focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
