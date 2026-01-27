"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrendingUp, Plus, AlertCircle, Bookmark, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockScore {
    id: number;
    testName: string;
    mathScore: number; // Percentage
    gaScore: number; // Percentage
    date: string;
}

const INITIAL_SCORES: MockScore[] = [
    { id: 1, testName: "RRB Mock #1", mathScore: 75, gaScore: 55, date: "2026-01-20" },
    { id: 2, testName: "SSC CGL Full #3", mathScore: 82, gaScore: 65, date: "2026-01-22" },
];

export function MockTestAnalytics() {
    const [scores, setScores] = useState<MockScore[]>(INITIAL_SCORES);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // New state for form
    const [newTestName, setNewTestName] = useState("");
    const [newMathScore, setNewMathScore] = useState("");
    const [newGaScore, setNewGaScore] = useState("");

    // Derived Analytics
    const latestScore = scores[scores.length - 1];
    const weakTopics = [];
    if (latestScore && latestScore.mathScore < 60) weakTopics.push("Mathematics");
    if (latestScore && latestScore.gaScore < 60) weakTopics.push("General Awareness");

    // Add Score Handler
    const handleAddScore = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newTestName || !newMathScore || !newGaScore) return;

        const newScore: MockScore = {
            id: Date.now(),
            testName: newTestName,
            mathScore: Number(newMathScore),
            gaScore: Number(newGaScore),
            date: new Date().toISOString().split('T')[0]
        };

        setScores([...scores, newScore]);
        
        // Reset and close
        setNewTestName("");
        setNewMathScore("");
        setNewGaScore("");
        setIsFormOpen(false);
    };

    return (
        <GlassCard className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Mock Test Analytics</h3>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                >
                    {isFormOpen ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} 
                    {isFormOpen ? "Cancel" : "Add Score"}
                </button>
            </div>

            {/* Form */}
            {isFormOpen && (
                <form onSubmit={handleAddScore} className="p-3 bg-white/5 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 border border-white/10">
                    <div className="space-y-2">
                         <div>
                            <label className="text-[10px] text-gray-400 uppercase font-bold ml-1">Test Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. RRB NTPC Mock #5" 
                                value={newTestName}
                                onChange={(e) => setNewTestName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label className="text-[10px] text-gray-400 uppercase font-bold ml-1">Math %</label>
                                <input 
                                    type="number" 
                                    placeholder="0-100" 
                                    min="0"
                                    max="100"
                                    value={newMathScore}
                                    onChange={(e) => setNewMathScore(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-[10px] text-gray-400 uppercase font-bold ml-1">GA %</label>
                                <input 
                                    type="number" 
                                    placeholder="0-100" 
                                    min="0"
                                    max="100"
                                    value={newGaScore}
                                    onChange={(e) => setNewGaScore(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-1">
                        <button 
                            type="submit" 
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded hover:bg-blue-600/40 transition-all"
                        >
                            <Plus className="w-3 h-3" /> Save Entry
                        </button>
                    </div>
                </form>
            )}

            {/* Heatmap / Bars */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {scores.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">No scores added yet.</div>
                ) : (
                    scores.slice().reverse().map(score => (
                        <div key={score.id} className="flex flex-col gap-1 text-sm pb-2 border-b border-white/5 last:border-0">
                            <div className="flex justify-between text-gray-400 text-xs">
                                <span className="font-medium text-gray-300">{score.testName}</span>
                                <span>{score.date}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {/* Math Bar */}
                                <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden group">
                                    <div
                                        className={cn("absolute h-full rounded-full transition-all duration-500", score.mathScore >= 80 ? "bg-green-500" : score.mathScore >= 60 ? "bg-yellow-500" : "bg-red-500")}
                                        style={{ width: `${score.mathScore}%` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[10px] text-white font-bold backdrop-blur-sm">
                                        Math: {score.mathScore}%
                                    </div>
                                </div>
                                {/* GA Bar */}
                                <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden group">
                                    <div
                                        className={cn("absolute h-full rounded-full transition-all duration-500", score.gaScore >= 80 ? "bg-green-500" : score.gaScore >= 60 ? "bg-yellow-500" : "bg-red-500")}
                                        style={{ width: `${score.gaScore}%` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[10px] text-white font-bold backdrop-blur-sm">
                                        GA: {score.gaScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Smart Pinning Logic */}
            {weakTopics.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-in slide-in-from-bottom-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-bold text-red-300">Weak Area Detected</h4>
                        <p className="text-xs text-red-200/70 mb-2">
                            Performance in <b>{weakTopics.join(" & ")}</b> is below 60%.
                        </p>
                        <button className="flex items-center gap-1 text-[10px] px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors">
                            <Bookmark className="w-3 h-3" /> Pin to Daily Tips
                        </button>
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
