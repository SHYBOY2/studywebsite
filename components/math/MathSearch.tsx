"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ShortcutCard } from "./ShortcutCard";
import { SHORTCUTS } from "@/data/shortcuts";

export function MathSearch() {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(SHORTCUTS.map(s => s.category)));

    const filteredShortcuts = SHORTCUTS.filter(shortcut => {
        const matchesQuery = shortcut.title.toLowerCase().includes(query.toLowerCase()) ||
            shortcut.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = selectedCategory ? shortcut.category === selectedCategory : true;
        return matchesQuery && matchesCategory;
    });

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search math tricks..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-colors"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors border ${selectedCategory === null
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors border ${selectedCategory === cat
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShortcuts.map(shortcut => (
                    <ShortcutCard key={shortcut.id} {...shortcut} />
                ))}
            </div>
        </div>
    );
}
