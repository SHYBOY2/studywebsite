"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, Trash2, CheckCircle, Circle, Target, Calendar, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface Goals {
    daily: Task[];
    weekly: string[];
    monthly: string[];
    exam: string[];
}

export function StudyPlanner() {
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'exam'>('daily');
    const [goals, setGoals] = useState<Goals>({
        daily: [],
        weekly: [],
        monthly: [],
        exam: []
    });
    const [newItem, setNewItem] = useState("");

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
                daily: [...prev.daily, { id: Date.now().toString(), text: newItem, completed: false }]
            }));
        } else {
            setGoals(prev => ({
                ...prev,
                [activeTab]: [...prev[activeTab], newItem]
            }));
        }
        setNewItem("");
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

    return (
        <GlassCard className="h-full flex flex-col min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <Target className="w-5 h-5 text-pink-400" />
                <h2 className="text-xl font-bold text-white">Study Planner</h2>
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
            <form onSubmit={addItem} className="relative mb-6">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={activeTab === 'daily' ? "Add a new task..." : `Add a ${activeTab} goal...`}
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                />
                <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors"
                >
                    <Plus className="w-4 h-4" />
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
                                        <span className={`text-sm ${task.completed ? "text-gray-500 line-through" : "text-gray-200"}`}>
                                            {task.text}
                                        </span>
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
}
