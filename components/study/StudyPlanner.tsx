"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, Trash2, CheckCircle, Circle, Target, Calendar, Award, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
    id: string;
    text: string;
    time?: string;
    completed: boolean;
}

interface Goals {
    daily: Task[];
    weekly: string[];
    monthly: string[];
    exam: string[];
}

interface StudyPlannerProps {
    onClose?: () => void;
    isModal?: boolean;
}

export function StudyPlanner({ onClose, isModal = false }: StudyPlannerProps) {
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'exam'>('daily');
    const [goals, setGoals] = useState<Goals>({
        daily: [],
        weekly: [],
        monthly: [],
        exam: []
    });
    const [newItem, setNewItem] = useState("");
    const [newTime, setNewTime] = useState("");

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('study_planner_goals');
        if (saved) {
            try {
                setGoals(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse goals", e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('study_planner_goals', JSON.stringify(goals));
    }, [goals]);

    const addItem = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newItem.trim()) return;

        if (activeTab === 'daily') {
            setGoals(prev => ({
                ...prev,
                daily: [...prev.daily, { id: Date.now().toString(), text: newItem, time: newTime, completed: false }]
            }));
        } else {
            setGoals(prev => ({
                ...prev,
                [activeTab]: [...prev[activeTab], newItem]
            }));
        }
        setNewItem("");
        setNewTime("");
    };

    const toggleDailyTask = (id: string) => {
        setGoals(prev => ({
            ...prev,
            daily: prev.daily.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
    };

    const deleteItem = (idx: number, id?: string) => {
        if (activeTab === 'daily' && id) {
            setGoals(prev => ({
                ...prev,
                daily: prev.daily.filter(t => t.id !== id)
            }));
        } else {
            setGoals(prev => ({
                ...prev,
                [activeTab]: prev[activeTab].filter((_, i) => i !== idx)
            }));
        }
    };

    const tabs = [
        { id: 'daily', label: 'Daily Plan', icon: Calendar },
        { id: 'weekly', label: 'Weekly', icon: Target },
        { id: 'monthly', label: 'Monthly', icon: Award },
        { id: 'exam', label: 'Exam Goals', icon: Target },
    ];

    const Content = (
        <GlassCard className={`h-full flex flex-col ${isModal ? 'min-h-[500px] border-pink-500/20' : 'min-h-[400px]'}`}>
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-400" />
                    <h2 className="text-xl font-bold text-white">Study Planner</h2>
                </div>
                {isModal && onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                                : "bg-white/5 text-gray-400 hover:text-white"
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={addItem} className="relative mb-6 flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder={activeTab === 'daily' ? "Add a new task..." : `Add a ${activeTab} goal...`}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-4 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                    />
                </div>
                {activeTab === 'daily' && (
                    <div className="relative w-24">
                        <input
                            type="text"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            placeholder="Time"
                            title="e.g. 2h, 30m"
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-8 pr-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                        />
                        <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                )}
                <button
                    type="submit"
                    className="p-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {activeTab === 'daily' ? (
                        goals.daily.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm py-8">No tasks for today yet.</div>
                        ) : (
                            goals.daily.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                                >
                                    <button
                                        onClick={() => toggleDailyTask(task.id)}
                                        className="flex items-center gap-3 flex-1 text-left"
                                    >
                                        {task.completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-500 shrink-0 group-hover:text-pink-400 transition-colors" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className={`text-sm ${task.completed ? "text-gray-500 line-through" : "text-gray-200"}`}>
                                                {task.text}
                                            </span>
                                            {task.time && (
                                                <span className="text-xs text-pink-400/80 font-medium flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" /> {task.time}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => deleteItem(0, task.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))
                        )
                    ) : (
                        goals[activeTab].length === 0 ? (
                            <div className="text-center text-gray-500 text-sm py-8">No goals set.</div>
                        ) : (
                            goals[activeTab].map((item, idx) => (
                                <motion.div
                                    key={`${activeTab}-${idx}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-500/50 shrink-0" />
                                        <span className="text-sm text-gray-200">{item}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteItem(idx)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))
                        )
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg relative"
                >
                    {Content}
                </motion.div>
            </div>
        );
    }

    return Content;
}
