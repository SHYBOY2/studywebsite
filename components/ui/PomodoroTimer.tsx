"use client";

import { useState, useEffect } from "react";
import { Timer, Coffee, Play, Pause, RotateCcw, Lightbulb, Calendar, History } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { StudyLog } from "@/lib/study-log";
import { StudyCalendar } from "@/components/study/StudyCalendar";
import { motion } from "framer-motion";

const FACTS = [
    "Article 324: Superintendence, direction and control of elections to be vested in an Election Commission.",
    "Planck's constant (h) is approximately 6.626 x 10^-34 joule-seconds.",
    "The Battle of Plassey was fought in 1757.",
    "Blue Vitriol is Copper Sulfate (CuSO4.5H2O).",
    "The longest river in India is the Ganga (2,525 km).",
    "First President of Indian National Congress was W.C. Bonnerjee."
];

const STUDY_DURATION = 45 * 60;
const BREAK_DURATION = 15 * 60;

export function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(STUDY_DURATION);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"study" | "break">("study");
    const [currentFact, setCurrentFact] = useState(FACTS[0]);
    const [lastLoggedTimeLeft, setLastLoggedTimeLeft] = useState(STUDY_DURATION);

    // Stats State
    const [todayMinutes, setTodayMinutes] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);

    // Initial load of stats
    useEffect(() => {
        setTodayMinutes(StudyLog.getTodayTotal());
    }, []);



    const saveProgress = () => {
        if (mode !== 'study') return;

        const elapsed = lastLoggedTimeLeft - timeLeft;
        if (elapsed > 0) {
            const minutes = elapsed / 60;
            StudyLog.addSession(minutes);
            setTodayMinutes(prev => prev + minutes);
            setLastLoggedTimeLeft(timeLeft);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);

            // Logic when timer ends: Switch modes and LOG if was studying
            if (mode === "study") {
                // Log the completed session
                const elapsed = lastLoggedTimeLeft; // timeLeft is 0
                if (elapsed > 0) {
                    const minutes = elapsed / 60;
                    StudyLog.addSession(minutes);
                    setTodayMinutes(prev => prev + minutes);
                }

                // Switch to break
                setMode("break");
                setTimeLeft(BREAK_DURATION);
                setLastLoggedTimeLeft(BREAK_DURATION); // Not tracked for stats but resets logic
                setCurrentFact(FACTS[Math.floor(Math.random() * FACTS.length)]);

                // Play notification sound (optional, browser policy restricts autoplay)
                // new Audio('/notification.mp3').play().catch(() => {});
            } else {
                setMode("study");
                setTimeLeft(STUDY_DURATION);
                setLastLoggedTimeLeft(STUDY_DURATION);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => {
        if (isActive) {
            saveProgress();
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        if (isActive || mode === 'study') {
            saveProgress();
        }
        setIsActive(false);
        setMode("study");
        setTimeLeft(STUDY_DURATION);
        setLastLoggedTimeLeft(STUDY_DURATION);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <>
            <GlassCard className="flex flex-col sm:flex-row items-center gap-4 py-3 px-5 border-purple-500/20 bg-purple-900/10 relative overflow-hidden group">
                {/* Progress Bar Background */}
                <div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-linear opacity-50"
                    style={{
                        width: `${((mode === 'study' ? STUDY_DURATION : BREAK_DURATION) - timeLeft) / (mode === 'study' ? STUDY_DURATION : BREAK_DURATION) * 100}%`
                    }}
                />

                {/* Timer Display */}
                <div className="flex flex-col items-center min-w-[80px]">
                    <span className={cn("text-3xl font-mono font-bold tracking-tight", mode === 'study' ? "text-white" : "text-emerald-400")}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                        {mode === 'study' ? <Timer className="w-3 h-3" /> : <Coffee className="w-3 h-3" />}
                        {mode === 'study' ? "Focus" : "Break"}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={toggleTimer}
                        className={cn(
                            "p-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg",
                            isActive
                                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                                : "bg-purple-600 text-white hover:bg-purple-500"
                        )}
                    >
                        {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <button onClick={resetTimer} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-px h-8 bg-white/10 hidden sm:block mx-2" />

                {/* Daily Stats */}
                <div className="flex flex-col items-start gap-1 min-w-[100px]">
                    <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Today's Focus</div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                        <span className="text-pink-400 font-bold text-lg">{formatDuration(todayMinutes)}</span>
                    </div>
                </div>

                {/* Calendar Toggle */}
                <button
                    onClick={() => setShowCalendar(true)}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-pink-400 transition-colors ml-auto sm:ml-0"
                    title="View History"
                >
                    <Calendar className="w-5 h-5" />
                </button>

                {/* Fact Section (only in break) */}
                {mode === 'break' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:flex flex-1 items-center gap-3 border-l border-white/10 pl-4 py-1"
                    >
                        <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Quick Fact</h4>
                            <p className="text-xs text-gray-300 line-clamp-1 italic">"{currentFact}"</p>
                        </div>
                    </motion.div>
                )}
            </GlassCard>

            {/* Calendar Modal */}
            {showCalendar && <StudyCalendar onClose={() => setShowCalendar(false)} />}
        </>
    );
}
