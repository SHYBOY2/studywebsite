"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, RotateCcw, Timer, Trophy, Zap, ArrowRight, Plus, Minus, X as XIcon, Divide, Percent, Shuffle, Clock, CheckCircle, XCircle, BarChart3, TrendingUp, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'percentage' | 'mixed';
type TimeOption = 30 | 60 | 120 | 'custom';

interface Question {
    id: number;
    text: string;
    answer: number;
    options: number[];
    category: Category;
}

interface GameStats {
    total: number;
    correct: number;
    wrong: number;
    streak: number;
    maxStreak: number;
    score: number;
}

interface SessionRecord {
    date: string;
    score: number;
    accuracy: number;
    category: Category;
    difficulty: Difficulty;
}

const CATEGORIES: { id: Category; label: string; icon: any; color: string; tip: string }[] = [
    { id: 'addition', label: 'Addition', icon: Plus, color: 'text-blue-400', tip: "Look for complements of 10 (e.g., 7+3, 6+4) to group numbers quickly." },
    { id: 'subtraction', label: 'Subtraction', icon: Minus, color: 'text-red-400', tip: "Think of subtraction as 'distance' between numbers. Add up from the smaller number." },
    { id: 'multiplication', label: 'Multiplication', icon: XIcon, color: 'text-purple-400', tip: "For numbers near 100, use the base method. For x11, separate digits and sum them in the middle." },
    { id: 'division', label: 'Division', icon: Divide, color: 'text-orange-400', tip: "Divisibility by 9: Sum of digits is divisible by 9. Divisibility by 5: Ends in 0 or 5." },
    { id: 'percentage', label: 'Percentage', icon: Percent, color: 'text-green-400', tip: "Split into 10% (move decimal) and 50% (half). 15% is 10% + 5%." },
    { id: 'mixed', label: 'Mixed Drill', icon: Shuffle, color: 'text-indigo-400', tip: "Stay flexible. Switching contexts rapidly is the best brain training." },
];

export function FastMathDrill() {
    // Game Config & State
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [category, setCategory] = useState<Category>('mixed');
    const [timeSetting, setTimeSetting] = useState<TimeOption>(60);
    const [customTime, setCustomTime] = useState(180); // Default custom 3 mins

    // Live Stats
    const [timeLeft, setTimeLeft] = useState(60);
    const [stats, setStats] = useState<GameStats>({ total: 0, correct: 0, wrong: 0, streak: 0, maxStreak: 0, score: 0 });
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

    // Analytics
    const [history, setHistory] = useState<SessionRecord[]>([]);
    const [personalBest, setPersonalBest] = useState(0);

    // Load history
    useEffect(() => {
        const saved = localStorage.getItem('fast_math_history');
        const best = localStorage.getItem('fast_math_pb');
        if (saved) setHistory(JSON.parse(saved));
        if (best) setPersonalBest(parseInt(best));
    }, []);

    const generateQuestion = useCallback(() => {
        let op: Category = category;
        if (category === 'mixed') {
            const types: Category[] = ['addition', 'subtraction', 'multiplication', 'division', 'percentage'];
            op = types[Math.floor(Math.random() * types.length)];
        }

        let num1 = 0, num2 = 0, answer = 0, text = "";
        const range = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
        const min = difficulty === 'easy' ? 2 : 5;

        switch (op) {
            case 'addition':
                num1 = Math.floor(Math.random() * range) + min;
                num2 = Math.floor(Math.random() * range) + min;
                answer = num1 + num2;
                text = `${num1} + ${num2}`;
                break;
            case 'subtraction':
                num1 = Math.floor(Math.random() * range) + min;
                num2 = Math.floor(Math.random() * range) + min;
                if (num1 < num2) [num1, num2] = [num2, num1];
                answer = num1 - num2;
                text = `${num1} - ${num2}`;
                break;
            case 'multiplication':
                const mRange = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 15; // Tighter range for mental math
                num1 = Math.floor(Math.random() * mRange) + 2;
                num2 = Math.floor(Math.random() * mRange) + 2;
                answer = num1 * num2;
                text = `${num1} × ${num2}`;
                break;
            case 'division':
                const dRange = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 15;
                num2 = Math.floor(Math.random() * dRange) + 2;
                answer = Math.floor(Math.random() * dRange) + 2;
                num1 = num2 * answer;
                text = `${num1} ÷ ${num2}`;
                break;
            case 'percentage':
                let percents = [10, 20, 25, 50];
                if (difficulty !== 'easy') percents = [...percents, 5, 15, 30, 40, 60, 75, 80, 90];
                num1 = percents[Math.floor(Math.random() * percents.length)];

                // Pick num2 to ensure clean integer result mostly
                const multiplier = Math.floor(Math.random() * (difficulty === 'easy' ? 10 : 20)) + 1;
                // Simplified generic logic for clean stats
                if (num1 % 25 === 0) num2 = multiplier * 4;
                else if (num1 % 20 === 0) num2 = multiplier * 5;
                else if (num1 % 10 === 0) num2 = multiplier * 10;
                else if (num1 % 5 === 0) num2 = multiplier * 20;
                else num2 = multiplier * 100;

                answer = (num1 * num2) / 100;
                text = `${num1}% of ${num2}`;
                break;
        }

        // Options Generation
        const options = new Set<number>();
        options.add(answer);
        let attempts = 0;
        while (options.size < 4 && attempts < 20) {
            attempts++;
            let offset = 0;
            // Adaptive offset based on answer magnitude
            const mag = Math.max(1, Math.abs(answer));
            const rangeOffset = Math.max(1, Math.floor(mag * 0.2)); // 20% variance
            offset = Math.floor(Math.random() * (rangeOffset * 2)) - rangeOffset;

            if (offset === 0) continue;
            const option = answer + offset;
            if (option < 0 && answer >= 0) continue; // No negatives if answer positive
            options.add(option);
        }
        while (options.size < 4) options.add(Math.floor(Math.random() * 100)); // Fallback

        return {
            id: Date.now(),
            text,
            answer,
            options: Array.from(options).sort(() => Math.random() - 0.5),
            category: op
        };

    }, [difficulty, category]);

    const startGame = (cat?: Category) => {
        if (cat) setCategory(cat);
        const duration = timeSetting === 'custom' ? customTime : timeSetting;
        setTimeLeft(duration);
        setStats({ total: 0, correct: 0, wrong: 0, streak: 0, maxStreak: 0, score: 0 });
        setGameState('playing');
        // Initial question is set by effect when state changes
    };

    // Timer Loop
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Ensure first question
    useEffect(() => {
        if (gameState === 'playing') setCurrentQuestion(generateQuestion());
    }, [gameState, generateQuestion]);

    const handleAnswer = (val: number) => {
        if (!currentQuestion) return;
        const isCorrect = val === currentQuestion.answer;

        setStats(prev => {
            const newStreak = isCorrect ? prev.streak + 1 : 0;
            const points = isCorrect ? (10 + Math.floor(prev.streak / 5) * 5) : 0;
            return {
                total: prev.total + 1,
                correct: prev.correct + (isCorrect ? 1 : 0),
                wrong: prev.wrong + (isCorrect ? 0 : 1),
                streak: newStreak,
                maxStreak: Math.max(prev.maxStreak, newStreak),
                score: prev.score + points
            };
        });

        setCurrentQuestion(generateQuestion());
    };

    const endGame = () => {
        setGameState('results');
        if (stats.score > personalBest) {
            setPersonalBest(stats.score);
            localStorage.setItem('fast_math_pb', stats.score.toString());
        }

        // Save history
        const record: SessionRecord = {
            date: new Date().toISOString(),
            score: stats.score,
            accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
            category,
            difficulty
        };
        const newHistory = [record, ...history].slice(0, 10); // Keep last 10
        setHistory(newHistory);
        localStorage.setItem('fast_math_history', JSON.stringify(newHistory));
    };

    const getAccuracyColor = (acc: number) => {
        if (acc >= 90) return 'text-emerald-400';
        if (acc >= 70) return 'text-blue-400';
        if (acc >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <GlassCard className="min-h-[550px] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none" />

                <AnimatePresence mode="wait">
                    {/* MENU STATE */}
                    {gameState === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8 z-10 w-full max-w-2xl"
                        >
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white">Fast Math Accelerator</h2>
                                <p className="text-gray-400">Select your drill parameters.</p>
                            </div>

                            {/* Controls Row */}
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="bg-slate-800/50 p-1.5 rounded-xl border border-white/5 flex gap-1">
                                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDifficulty(d)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${difficulty === d ? 'bg-blue-600/80 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-slate-800/50 p-1.5 rounded-xl border border-white/5 flex gap-1 items-center">
                                    <Clock className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                                    {([30, 60, 120] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTimeSetting(t)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeSetting === t ? 'bg-emerald-600/80 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {t}s
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const val = prompt("Enter seconds (10-300):", "180");
                                            if (val) {
                                                const num = Math.min(300, Math.max(10, parseInt(val)));
                                                setCustomTime(num);
                                                setTimeSetting('custom');
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeSetting === 'custom' ? 'bg-emerald-600/80 text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Custom
                                    </button>
                                </div>
                            </div>

                            {/* Category Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => startGame(cat.id)}
                                        className="group p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/80 hover:border-blue-500/30 transition-all hover:-translate-y-1 text-left relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${cat.color}`}>
                                            <cat.icon className="w-16 h-16 transform rotate-12" />
                                        </div>
                                        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2 ${cat.color}`}>
                                            <cat.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-gray-200 group-hover:text-white">{cat.label}</h3>
                                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{cat.tip}</p>
                                    </button>
                                ))}
                            </div>

                            {history.length > 0 && (
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-yellow-500" />
                                            Best: <span className="text-white font-bold">{personalBest}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-blue-500" />
                                            Recent Avg: <span className="text-white font-bold">{Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* PLAYING STATE */}
                    {gameState === 'playing' && currentQuestion && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-lg space-y-8 z-10"
                        >
                            {/* HUD */}
                            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between shadow-xl">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Time</span>
                                    <div className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="flex flex-col items-center px-4">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Score</span>
                                    <span className="text-2xl font-bold text-blue-400">{stats.score}</span>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                                        <span>{stats.correct}</span> <CheckCircle className="w-3 h-3" />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-red-400">
                                        <span>{stats.wrong}</span> <XCircle className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar (Time) */}
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${(timeLeft / (timeSetting === 'custom' ? customTime : timeSetting)) * 100}%` }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </div>

                            {/* Question Card */}
                            <div className="text-center py-12 relative group">
                                <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                                <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 tracking-tight relative z-10">
                                    {currentQuestion.text}
                                </span>
                                {stats.streak > 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-4 right-0 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-orange-500/20"
                                    >
                                        <Zap className="w-3 h-3 fill-current" /> {stats.streak} Streak
                                    </motion.div>
                                )}
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={`${currentQuestion.id}-${idx}`}
                                        onClick={() => handleAnswer(option)}
                                        className="p-6 text-3xl font-bold bg-slate-800/40 hover:bg-blue-600 hover:border-blue-500 border border-white/10 rounded-2xl transition-all active:scale-95 text-white shadow-lg hover:shadow-blue-500/25"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* RESULTS STATE */}
                    {gameState === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6 z-10 w-full max-w-xl"
                        >
                            <div className="relative inline-block mb-4">
                                <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
                                <Trophy className="w-24 h-24 text-yellow-400 relative z-10 mx-auto drop-shadow-lg" />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Score</div>
                                    <div className="text-3xl font-black text-white">{stats.score}</div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Accuracy</div>
                                    <div className={`text-3xl font-black ${getAccuracyColor(stats.total > 0 ? (stats.correct / stats.total) * 100 : 0)}`}>
                                        {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Max Streak</div>
                                    <div className="text-3xl font-black text-orange-400">{stats.maxStreak}</div>
                                </div>
                            </div>

                            {/* Smart Feedback */}
                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-5 text-left flex gap-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg h-fit text-blue-400">
                                    <Lightbulb className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-100 mb-1">Vedic Tip: {CATEGORIES.find(c => c.id === category)?.label}</h4>
                                    <p className="text-sm text-blue-200/80 leading-relaxed">
                                        {CATEGORIES.find(c => c.id === category)?.tip}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center pt-8">
                                <button
                                    onClick={() => setGameState('menu')}
                                    className="px-8 py-3 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors font-medium border border-white/5"
                                >
                                    Menu
                                </button>
                                <button
                                    onClick={() => startGame()}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors font-bold shadow-lg shadow-blue-500/20 hover:scale-105"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Retry Drill
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    );
}
