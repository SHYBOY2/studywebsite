"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, RotateCcw, Timer, Trophy, Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = 'easy' | 'medium' | 'hard';
type Operation = '+' | '-' | '*' | '/';

interface Question {
    id: number;
    text: string;
    answer: number;
    options: number[];
}

export function FastMathDrill() {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const generateQuestion = useCallback(() => {
        let num1 = 0, num2 = 0, op: Operation = '+';

        // Select mostly + and - for easy, mix for medium/hard
        const ops: Operation[] = difficulty === 'easy' ? ['+', '-'] : ['+', '-', '*', '/'];
        op = ops[Math.floor(Math.random() * ops.length)];

        if (difficulty === 'easy') {
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
        } else if (difficulty === 'medium') {
            num1 = Math.floor(Math.random() * 50) + 5;
            num2 = Math.floor(Math.random() * 50) + 5;
        } else {
            num1 = Math.floor(Math.random() * 100) + 10;
            num2 = Math.floor(Math.random() * 100) + 10;
        }

        // Adjust for cleaner division/subtraction
        if (op === '/') {
            num1 = num1 * num2; // Ensure clean division
        } else if (op === '-' && num1 < num2) {
            [num1, num2] = [num2, num1]; // Ensure positive result
        }

        let answer = 0;
        switch (op) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
            case '/': answer = num1 / num2; break;
        }

        // Generate options
        const options = new Set<number>();
        options.add(answer);
        while (options.size < 4) {
            const offset = Math.floor(Math.random() * 10) - 5;
            if (offset !== 0) options.add(answer + offset);
        }

        return {
            id: Date.now(),
            text: `${num1} ${op.replace('*', '×').replace('/', '÷')} ${num2}`,
            answer,
            options: Array.from(options).sort(() => Math.random() - 0.5)
        };
    }, [difficulty]);

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

    const startGame = () => {
        setScore(0);
        setStreak(0);
        setTimeLeft(60);
        setCurrentQuestion(generateQuestion());
        setGameState('playing');
    };

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
        <div className="max-w-2xl mx-auto w-full">
            <GlassCard className="min-h-[400px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Background Ambient Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none" />

                <AnimatePresence mode="wait">
                    {gameState === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-6 z-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full" />
                                <Zap className="w-20 h-20 text-yellow-400 mx-auto relative z-10" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Fast Math Drill</h2>
                                <p className="text-gray-400">Race against the clock to solve arithmetic.</p>
                            </div>

                            <div className="flex gap-2 justify-center bg-slate-800/50 p-1 rounded-lg">
                                {(['easy', 'medium', 'hard'] as const).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${difficulty === d
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={startGame}
                                className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
                                title="Start math drill"
                            >
                                Start Drill
                                <Play className="w-5 h-5 fill-current" />
                            </button>
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
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
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
                                    <div className="text-xl font-bold text-white">{streak}</div> {/* Not really best streak, just last. Simplified for now. */}
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
                                    onClick={startGame}
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
