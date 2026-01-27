import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
    return (
        <div className={cn("glass-card rounded-xl p-6 border border-white/10", className)}>
            {children}
        </div>
    );
}
