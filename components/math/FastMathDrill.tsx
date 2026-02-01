"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, RotateCcw, Timer, Trophy, Zap, ArrowRight, Plus, Minus, X as XIcon, Divide, Percent, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'percentage' | 'mixed';

interface Question {
    id: number;
    text: string;
    answer: number;
    options: number[];
}

const CATEGORIES: { id: Category; label: string; icon: any; color: string }[] = [
    { id: 'addition', label: 'Addition', icon: Plus, color: 'text-blue-400' },
    { id: 'subtraction', label: 'Subtraction', icon: Minus, color: 'text-red-400' },
    { id: 'multiplication', label: 'Multiplication', icon: XIcon, color: 'text-purple-400' },
    { id: 'division', label: 'Division', icon: Divide, color: 'text-orange-400' },
    { id: 'percentage', label: 'Percentage', icon: Percent, color: 'text-green-400' },
    { id: 'mixed', label: 'Mixed Drill', icon: Shuffle, color: 'text-indigo-400' },
];

export function FastMathDrill() {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [category, setCategory] = useState<Category>('mixed');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const generateQuestion = useCallback(() => {
        let op: Category = category;

        // If mixed, pick a random category (excluding mixed itself)
        if (category === 'mixed') {
            const types: Category[] = ['addition', 'subtraction', 'multiplication', 'division', 'percentage'];
            op = types[Math.floor(Math.random() * types.length)];
        }

        let num1 = 0, num2 = 0;
        let text = "";
        let answer = 0;

        // Difficulty scalers
        const range = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
        const min = difficulty === 'easy' ? 1 : 5;

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
                if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure positive
                answer = num1 - num2;
                text = `${num1} - ${num2}`;
                break;
            case 'multiplication':
                const mRange = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 20;
                num1 = Math.floor(Math.random() * mRange) + 2;
                num2 = Math.floor(Math.random() * mRange) + 2;
                answer = num1 * num2;
                text = `${num1} × ${num2}`;
                break;
            case 'division':
                const dRange = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 12 : 20;
                num2 = Math.floor(Math.random() * dRange) + 2; // Divisor
                answer = Math.floor(Math.random() * dRange) + 2; // Quotient
                num1 = num2 * answer; // Dividend
                text = `${num1} ÷ ${num2}`;
                break;
            case 'percentage':
                // Easy: 10%, 20%, 25%, 50%
                // Medium: 5%, 15%, 30%, 40%, 60%, 75%, 80%, 90%
                // Hard: 1% to 100%
                let percents = [10, 20, 25, 50];
                if (difficulty === 'medium') percents = [...percents, 5, 15, 30, 40, 60, 70, 75, 80, 90];

                if (difficulty === 'hard') {
                    num1 = Math.floor(Math.random() * 100) + 1; // Any percent
                } else {
                    num1 = percents[Math.floor(Math.random() * percents.length)];
                }

                // Construct a clean number to take percent of
                // For easy/med, ensure result is integer.
                // x% of y = (x * y) / 100. So x*y must be divisible by 100.
                if (difficulty === 'hard') {
                    num2 = Math.floor(Math.random() * 200) + 10;
                    answer = (num1 * num2) / 100;
                    // For hard, maybe allow 1 decimal? Rounding for now to keep options simple integer based if possible
                    // Let's stick to integers for Drill consistency
                    while ((num1 * num2) % 100 !== 0) {
                        num2 = Math.floor(Math.random() * 200) + 10;
                    }
                    answer = (num1 * num2) / 100;
                } else {
                    // Find multiples of (100 / GCD(num1, 100))
                    // Simplification: just pick multiples of 100, 50, 25, 20, 10, 5 based on num1
                    // Easiest approach:
                    const multiplier = Math.floor(Math.random() * (difficulty === 'easy' ? 10 : 20)) + 1;
                    if (num1 % 50 === 0) num2 = multiplier * 2;
                    else if (num1 % 25 === 0) num2 = multiplier * 4;
                    else if (num1 % 20 === 0) num2 = multiplier * 5;
                    else if (num1 % 10 === 0) num2 = multiplier * 10;
                    else if (num1 % 5 === 0) num2 = multiplier * 20;
                    else num2 = multiplier * 100;

                    answer = (num1 * num2) / 100;
                }
                text = `${num1}% of ${num2}`;
                break;
        }

        // Generate options
        const options = new Set<number>();
        options.add(answer);

        let attempts = 0;
        while (options.size < 4 && attempts < 20) {
            attempts++;
            // Generate distinct wrong answers
            let offset = 0;
            if (op === 'percentage' || op === 'multiplication') {
                // For large numbers, offset should be larger
                const magnitude = Math.max(1, Math.floor(Math.log10(answer || 1)));
                const scale = Math.pow(10, magnitude);
                offset = (Math.floor(Math.random() * 10) - 5) * (scale / 10 || 1);
                if (offset === 0) offset = 1;
            } else {
                offset = Math.floor(Math.random() * 10) - 5;
            }

            // Avoid negative options if answer is positive
            if (answer + offset < 0 && answer >= 0) continue;

            if (offset !== 0) options.add(Math.round((answer + offset) * 100) / 100);
        }

        // If we still don't have enough options (rare), just fill
        while (options.size < 4) {
            options.add(answer + options.size + 1);
        }

        return {
            id: Date.now(),
            text,
            answer,
            options: Array.from(options).sort(() => Math.random() - 0.5)
        };
    }, [difficulty, category]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setGameState('results');
            if (score > highScore) setHighScore(score);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, score, highScore]);

    const startGame = (selectedCategory?: Category) => {
        if (selectedCategory) setCategory(selectedCategory);
        setScore(0);
        setStreak(0);
        setTimeLeft(60);
        // We need to set state then generate, or use the param directly.
        // But generateQuestion depends on state 'category'.
        // Better to wait for render or force update.
        // Actually, we can just set category first, and useEffect will trigger? No, generateQuestion is manual.
        // Let's pass the category to generate logic or just wait.
        // Simplest: set game state, then useEffect or just direct call if we refactor generate.
        // Refactoring generateQuestion to take optional category override
        setGameState('playing');
    };

    // Effect to generate first question when entering playing state
    useEffect(() => {
        if (gameState === 'playing') {
            setCurrentQuestion(generateQuestion());
        }
    }, [gameState, generateQuestion]);

    const handleAnswer = (selected: number) => {
        if (!currentQuestion) return;

        if (selected === currentQuestion.answer) {
            const points = 10 + Math.floor(streak / 5) * 5;
            setScore(prev => prev + points);
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }
        setCurrentQuestion(generateQuestion());
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <GlassCard className="min-h-[500px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Background Ambient Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none" />

                <AnimatePresence mode="wait">
                    {gameState === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8 z-10 w-full max-w-2xl"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-white mb-2">Fast Math Accelerator</h2>
                                <p className="text-gray-400">Select a drill to boost your calculation speed.</p>

                                {/* Difficulty Selector */}
                                <div className="inline-flex bg-slate-800/50 p-1 rounded-lg border border-white/5">
                                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDifficulty(d)}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${difficulty === d
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => startGame(cat.id)}
                                        className="group p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/80 hover:border-blue-500/30 transition-all hover:-translate-y-1"
                                    >
                                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform ${cat.color}`}>
                                            <cat.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-semibold text-gray-200 group-hover:text-white">{cat.label}</h3>
                                        <div className="text-xs text-gray-500 mt-1">Start Drill →</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'playing' && currentQuestion && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-md space-y-8 z-10"
                        >
                            <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-md ${streak > 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700 text-slate-400'}`}>
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span>Streak: {streak}</span>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-xl text-white">
                                    <Timer className={`w-5 h-5 ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                                    {timeLeft}s
                                </div>
                                <div className="px-3 py-1 bg-slate-800 rounded-full text-white">
                                    Score: {score}
                                </div>
                            </div>

                            <div className="text-center py-8">
                                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                                    {currentQuestion.text}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={`${currentQuestion.id}-${idx}`}
                                        onClick={() => handleAnswer(option)}
                                        className="p-4 text-2xl font-bold bg-slate-800/50 hover:bg-blue-600/20 hover:border-blue-500/50 border border-white/5 rounded-xl transition-all active:scale-95 text-white"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setGameState('menu')}
                                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    Quit Drill
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6 z-10"
                        >
                            <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />

                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Time's Up!</h3>
                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600">
                                    {score}
                                </div>
                                <p className="text-gray-400">Final Score</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left max-w-xs mx-auto">
                                <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                                    <div className="text-xs text-gray-400">High Score</div>
                                    <div className="text-xl font-bold text-white">{highScore}</div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                                    <div className="text-xs text-gray-400">Best Streak</div>
                                    <div className="text-xl font-bold text-white">{streak}</div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center pt-4">
                                <button
                                    onClick={() => setGameState('menu')}
                                    className="px-6 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium"
                                >
                                    Back to Menu
                                </button>
                                <button
                                    onClick={() => startGame()}
                                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors font-bold shadow-lg shadow-blue-500/20"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Try Again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    );
}
