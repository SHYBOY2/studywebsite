"use client";

import { JobTicker } from "@/components/dashboard/JobTicker";
import { MathSearch } from "@/components/math/MathSearch";
import { CountdownTimer } from "@/components/exam/CountdownTimer";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Trophy, Sparkles } from "lucide-react";
import { ExamCommandCenter } from "@/components/command-center/ExamCommandCenter";
import { PomodoroTimer } from "@/components/ui/PomodoroTimer";
import { MockTestAnalytics } from "@/components/analytics/MockTestAnalytics";


import { StudyPlanner } from "@/components/study/StudyPlanner";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Student Success Hub
          </h1>
          <p className="text-lg text-gray-400">
            Your competitive advantage.
          </p>
        </div>
        {/* Pomodoro Timer Integration */}
        <div className="w-full md:w-auto">
          <PomodoroTimer />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Job Tracker (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="h-[400px]">
            <JobTicker />
          </div>

          {/* Study Planner */}
          <div className="h-[500px]">
            <StudyPlanner />
          </div>

          {/* Mock Test Analytics (Moved to Left Column for balance) */}
          <MockTestAnalytics />
        </div>

        {/* Center Column: Math Engine (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Math Shortcut Engine</h2>
                <p className="text-sm text-gray-400">Interactive LaTeX formulas for instant revision</p>
              </div>
            </div>
            <MathSearch />
          </GlassCard>

          {/* Fast Math Drill Card */}
          <GlassCard className="relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Fast Math Accelerator</h3>
                  <p className="text-sm text-gray-400">Practice arithmetic drills to boost calculation speed.</p>
                </div>
              </div>
              <a
                href="/fast-math"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Start Drill
              </a>
            </div>
          </GlassCard>

          {/* Additional Resources / Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="bg-gradient-to-br from-emerald-900/40 to-emerald-900/10 border-emerald-500/20">
              <h3 className="font-semibold text-emerald-300 mb-2">Daily Tip</h3>
              <p className="text-sm text-gray-300">
                Consistent revision is key. Spend 15 minutes daily on mental math to improve speed by 2x in a month.
              </p>
            </GlassCard>
            <GlassCard className="bg-gradient-to-br from-amber-900/40 to-amber-900/10 border-amber-500/20">
              <h3 className="font-semibold text-amber-300 mb-2">Exam Strategy</h3>
              <p className="text-sm text-gray-300">
                Attempt the easiest section first to build confidence. Don't get stuck on one question for more than 40s.
              </p>
            </GlassCard>
            <GlassCard>
              <h3 className="font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-blue-300 cursor-pointer transition-colors">
                  <a href="/video-vault" className="flex items-center gap-2">
                    <span className="text-red-400">▶</span> Exam Video Vault
                  </a>
                </li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">→ UPSC Syllabus</li>
                <li className="hover:text-blue-300 cursor-pointer transition-colors">→ SSC CGL Previous Papers</li>
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Exam Portal (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <ExamCommandCenter />

          <GlassCard className="relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
            {/* ... keeping RRB card ... */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-yellow-400">Special Coverage</h3>
                <span className="text-[10px] uppercase font-bold bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">New</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">RRB Exam Hub</h4>
              <p className="text-sm text-gray-400 mb-4">
                NTPC & ALP Notebook with AI Chat and Video Modules.
              </p>
              <a
                href="/rrb"
                className="block w-full text-center py-2 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-500 transition-colors"
              >
                Open Smart Notebook →
              </a>
            </div>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            {/* ... keeping Notebook card ... */}
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">NotebookLM Explorer</h3>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Direct embedded access to your Google Notebooks.
            </p>
            <a href="/notebook" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              Launch Explorer →
            </a>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
