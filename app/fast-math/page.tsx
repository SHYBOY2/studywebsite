import { FastMathDrill } from "@/components/math/FastMathDrill";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FastMathPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Math Accelerator</h1>
                    <p className="text-gray-400">Drill your arithmetic speed and accuracy.</p>
                </div>
            </div>

            {/* Main Game Component */}
            <FastMathDrill />

            {/* Instructions / Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <strong className="text-blue-400 block mb-1">Speed is Key</strong>
                    <p>You have 60 seconds. Questions get harder, but points increase with streaks.</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <strong className="text-purple-400 block mb-1">Streak Bonus</strong>
                    <p>Maintain your streak to earn +5 bonus points for every 5 correct answers in a row.</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <strong className="text-emerald-400 block mb-1">Mental Gym</strong>
                    <p>Daily practice of 15 minutes can improve calculation speed by up to 300%.</p>
                </div>
            </div>
        </div>
    );
}
