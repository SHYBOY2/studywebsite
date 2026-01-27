"use client";

import { useState, useEffect } from "react";
import { Timer, Coffee, Play, Pause, RotateCcw, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const FACTS = [
    "Article 324: Superintendence, direction and control of elections to be vested in an Election Commission.",
    "Planck's constant (h) is approximately 6.626 x 10^-34 joule-seconds.",
    "The Battle of Plassey was fought in 1757.",
    "Blue Vitriol is Copper Sulfate (CuSO4.5H2O).",
    "The longest river in India is the Ganga (2,525 km).",
    "First President of Indian National Congress was W.C. Bonnerjee."
];

export function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes default
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"study" | "break">("study");
    const [currentFact, setCurrentFact] = useState(FACTS[0]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Logic when timer ends: Switch modes
            if (mode === "study") {
                setMode("break");
                setTimeLeft(15 * 60);
                // Show random fact
                setCurrentFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
            } else {
                setMode("study");
                setTimeLeft(45 * 60);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setMode("study");
        setTimeLeft(45 * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <GlassCard className="flex items-center gap-4 py-2 px-4 border-purple-500/20 bg-purple-900/10">
            <div className="flex flex-col items-center min-w-[80px]">
                <span className={cn("text-2xl font-mono font-bold", mode === 'study' ? "text-white" : "text-green-400")}>
                    {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    {mode === 'study' ? "Focus" : "Break"}
                </span>
            </div>

            <div className="flex gap-2">
                <button onClick={toggleTimer} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    {isActive ? <Pause className="w-4 h-4 text-yellow-400" /> : <Play className="w-4 h-4 text-green-400" />}
                </button>
                <button onClick={resetTimer} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {mode === 'break' && (
                <div className="hidden md:flex flex-1 items-center gap-2 border-l border-white/10 pl-4 animate-in fade-in slide-in-from-right-4">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div>
                        <h4 className="text-xs font-bold text-yellow-400">Quick Fact</h4>
                        <p className="text-xs text-gray-300 line-clamp-1">{currentFact}</p>
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
