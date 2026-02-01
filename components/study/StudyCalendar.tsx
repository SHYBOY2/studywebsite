"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StudyLog } from "@/lib/study-log";
import { ChevronLeft, ChevronRight, X, Clock, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StudyCalendarProps {
    onClose: () => void;
}

export function StudyCalendar({ onClose }: StudyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const stats = useMemo(() => StudyLog.getDailyStats(), []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Create calendar grid
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    const getIntensityColor = (minutes: number) => {
        if (minutes === 0) return "bg-white/5 text-gray-400";
        if (minutes < 30) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        if (minutes < 60) return "bg-indigo-500/30 text-indigo-300 border-indigo-500/40";
        if (minutes < 120) return "bg-purple-500/40 text-purple-200 border-purple-500/50";
        return "bg-pink-500/50 text-white border-pink-500/60 shadow-[0_0_10px_rgba(236,72,153,0.3)]";
    };

    const formatDateKey = (day: number) => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return d.toISOString().split('T')[0];
    };

    const selectedStats = selectedDate ? stats[selectedDate] || 0 : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md"
            >
                <GlassCard className="relative p-6 pt-12 overflow-hidden border-pink-500/20">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="absolute top-4 left-6 flex items-center gap-2 text-pink-400">
                        <CalendarIcon className="w-5 h-5" />
                        <span className="font-bold tracking-wide text-sm uppercase">Study History</span>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded-full">
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <h2 className="text-xl font-bold text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded-full">
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 text-center text-sm mb-6">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-gray-500 font-medium py-2">{d}</div>
                        ))}
                        {days.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />;

                            const dateKey = formatDateKey(day);
                            const minutes = stats[dateKey] || 0;
                            const isSelected = selectedDate === dateKey;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(dateKey)}
                                    className={cn(
                                        "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all border border-transparent",
                                        getIntensityColor(minutes),
                                        isSelected ? "ring-2 ring-white scale-110 z-10" : "hover:scale-105"
                                    )}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Date Stats */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDate || 'empty'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-slate-900/50 rounded-xl p-4 border border-white/5"
                        >
                            {selectedDate ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">
                                            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {Math.floor(selectedStats / 60)}h {selectedStats % 60}m
                                        </div>
                                        <div className="text-xs text-pink-400 font-medium">Total Focus Time</div>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-pink-400" />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-2">
                                    Click a date to view detailed stats
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                </GlassCard>
            </motion.div>
        </div>
    );
}
