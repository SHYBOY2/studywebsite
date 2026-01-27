"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock } from "lucide-react";

interface ExamDate {
    id: string;
    name: string;
    date: string; // ISO string
}

const UPCOMING_EXAMS: ExamDate[] = [
    { id: "1", name: "UPSC Prelims 2026", date: "2026-05-26T09:00:00" },
    { id: "2", name: "SSC CGL 2026", date: "2026-07-14T09:00:00" },
    { id: "3", name: "IBPS PO", date: "2026-10-15T09:00:00" },
];

function getTimeRemaining(endtime: string) {
    const total = Date.parse(endtime) - Date.parse(new Date().toISOString());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
}

export function CountdownTimer() {
    const [timers, setTimers] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimers: { [key: string]: string } = {};
            UPCOMING_EXAMS.forEach(exam => {
                const t = getTimeRemaining(exam.date);
                if (t.total > 0) {
                    newTimers[exam.id] = `${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s`;
                } else {
                    newTimers[exam.id] = "Exam Started/Ended";
                }
            });
            setTimers(newTimers);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4">
            {UPCOMING_EXAMS.map(exam => (
                <GlassCard key={exam.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200">{exam.name}</h4>
                            <p className="text-xs text-gray-400">{new Date(exam.date).toDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                            {timers[exam.id] || "Loading..."}
                        </span>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
