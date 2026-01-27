"use client";

import { NotebookExplorer } from "@/components/notebook/NotebookExplorer";

export default function NotebookPage() {
    return (
        <div className="h-[calc(100vh-theme(spacing.8))] flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-white">Smart Notebook Explorer</h1>
                <p className="text-sm text-gray-400">
                    Seamlessly integrated with your Google NotebookLM for advanced reasoning.
                </p>
            </div>
            <NotebookExplorer notebookId="YOUR_ACTUAL_NOTEBOOK_ID_HERE" />
        </div>
    );
}
