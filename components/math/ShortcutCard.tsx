"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import 'katex/dist/katex.min.css';
import React from 'react';
// @ts-ignore
import { BlockMath } from 'react-katex';

interface ShortcutCardProps {
    title: string;
    category: string;
    formula: string;
    description: string;
}

export function ShortcutCard({ title, category, formula, description }: ShortcutCardProps) {
    return (
        <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {category}
                </span>
            </div>
            <div className="py-4 px-2 bg-black/20 rounded-lg mb-3 overflow-x-auto text-center">
                <BlockMath math={formula} />
            </div>
            <p className="text-sm text-gray-400">{description}</p>
        </GlassCard>
    );
}
