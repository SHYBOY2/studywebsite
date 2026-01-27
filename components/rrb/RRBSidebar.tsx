"use client";

import { useState } from "react";
import { RRB_DATA, RRBModule, RRBSection } from "@/data/rrb";
import { cn } from "@/lib/utils";
import { Calculator, BrainCircuit, Globe2, ChevronRight, FileText, Youtube } from "lucide-react";

interface RRBSidebarProps {
    activeModule: RRBModule | null;
    onSelectModule: (module: RRBModule) => void;
}

export function RRBSidebar({ activeModule, onSelectModule }: RRBSidebarProps) {
    const [openSection, setOpenSection] = useState<string>("math");

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Math": return <Calculator className="w-4 h-4" />;
            case "Brain": return <BrainCircuit className="w-4 h-4" />;
            case "Globe": return <Globe2 className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
                    RRB Syllabus
                </h2>
                <p className="text-xs text-gray-400 mt-1">Smart Notebook Access</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {RRB_DATA.map((section) => (
                    <div key={section.id} className="rounded-lg overflow-hidden bg-white/5 border border-white/5">
                        <button
                            onClick={() => setOpenSection(openSection === section.id ? "" : section.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 text-sm font-medium transition-colors hover:bg-white/5",
                                openSection === section.id ? "text-yellow-400" : "text-gray-300"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {getIcon(section.icon)}
                                <span>{section.title}</span>
                            </div>
                            <ChevronRight className={cn("w-4 h-4 transition-transform", openSection === section.id ? "rotate-90" : "")} />
                        </button>

                        {openSection === section.id && (
                            <div className="bg-black/20 p-2 space-y-1">
                                {section.modules.map((mod) => (
                                    <button
                                        key={mod.id}
                                        onClick={() => onSelectModule(mod)}
                                        className={cn(
                                            "w-full text-left text-xs p-2 rounded-md flex items-center justify-between transition-all",
                                            activeModule?.id === mod.id
                                                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                                                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                            <span>{mod.title}</span>
                                        </div>
                                        {/* Traffic Light Status */}
                                        {mod.mastery && (
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                mod.mastery === 'red' ? "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" :
                                                    mod.mastery === 'yellow' ? "bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]" :
                                                        "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                                            )} title={`Mastery: ${mod.mastery}`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FileText className="w-3 h-3" />
                    <span>{RRB_DATA.reduce((acc, s) => acc + s.modules.length, 0)} Total Modules</span>
                </div>
            </div>
        </div>
    );
}
