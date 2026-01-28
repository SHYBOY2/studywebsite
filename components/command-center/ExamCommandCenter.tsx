"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NotificationModal } from "@/components/ui/NotificationModal";
import { EXAM_CALENDAR_2026, ExamEvent, ExamCategory } from "@/data/exams";
import { Calendar, Clock, Bell, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to determine status dynamically based on dates
function getDynamicStatus(exam: ExamEvent): { text: string; color: string } {
    const now = new Date();

    // Application Live Logic
    if (exam.applicationStart && exam.applicationEnd) {
        const start = new Date(exam.applicationStart);
        const end = new Date(exam.applicationEnd);
        if (now >= start && now <= end) {
            // Check for "Closing Soon" (last 7 days)
            const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) return { text: "Closing Soon", color: "text-red-400 bg-red-400/10 border-red-500/20" };
            return { text: "Application Live", color: "text-green-400 bg-green-400/10 border-green-500/20" };
        }
    }

    // Fallback to static status if date logic doesn't apply
    switch (exam.status) {
        case "Live": return { text: "Application Live", color: "text-green-400 bg-green-400/10 border-green-500/20" };
        case "Upcoming":
            // Check if start date is soon (within 30 days)
            if (exam.applicationStart && (new Date(exam.applicationStart).getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000)) {
                return { text: "Starting Soon", color: "text-yellow-400 bg-yellow-400/10 border-yellow-500/20" };
            }
            return { text: "Expected Soon", color: "text-yellow-400 bg-yellow-400/10 border-yellow-500/20" };
        case "Closed": return { text: "Closed", color: "text-gray-400 bg-gray-400/10 border-gray-500/20" };
        default: return { text: "Expected", color: "text-blue-300 bg-blue-400/10 border-blue-500/20" };
    }
}

export function ExamCommandCenter() {
    const [selectedCategory, setSelectedCategory] = useState<ExamCategory | "All">("All");
    const [notifyExam, setNotifyExam] = useState<ExamEvent | null>(null);

    const filteredExams = selectedCategory === "All"
        ? EXAM_CALENDAR_2026
        : EXAM_CALENDAR_2026.filter(e => e.category === selectedCategory);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Exam Command Center</h2>
                <div className="flex gap-2">
                    {(["All", "RRB", "SSC", "Banking"] as const).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                                selectedCategory === cat
                                    ? "bg-blue-600 border-blue-500 text-white"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExams.map(exam => {
                    const status = getDynamicStatus(exam);
                    const isLive = status.text.includes("Live") || status.text.includes("Closing");

                    return (
                        <GlassCard key={exam.id} className="relative overflow-hidden hover:border-blue-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{exam.category}</span>
                                    <h3 className="text-lg font-bold text-gray-100">{exam.name}</h3>
                                </div>
                                <span className={cn("px-2 py-1 rounded-full text-xs font-bold border", status.color)}>
                                    {status.text}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    <span>App Date: {exam.applicationStart ? new Date(exam.applicationStart).toLocaleDateString('en-GB') : "TBA"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span>Exam: <span className="text-gray-300">{exam.examDateText}</span></span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {isLive && exam.applyLink ? (
                                    <a
                                        href={exam.applyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-500 transition-colors"
                                    >
                                        Apply Now <ExternalLink className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => setNotifyExam(exam)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-gray-300 font-medium hover:bg-white/10 transition-colors"
                                    >
                                        <Bell className="w-4 h-4" /> Notify Me
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            <NotificationModal
                isOpen={!!notifyExam}
                onClose={() => setNotifyExam(null)}
                examName={notifyExam?.name || ""}
            />
        </div>
    );
}
