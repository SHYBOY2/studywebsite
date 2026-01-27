"use client";

import { Playlist } from "@/data/playlists";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlayCircle, ExternalLink, Youtube } from "lucide-react";

interface PlaylistCardProps {
    playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
    const playlistUrl = `https://www.youtube.com/playlist?list=${playlist.id}`;

    return (
        <GlassCard className="flex flex-col p-0 overflow-hidden group hover:border-red-500/40 transition-all duration-300">
            {/* Thumbnail Area */}
            <div className="relative h-40 bg-black/50 overflow-hidden">
                {/* In a real app, actual imgs. Here use placeholders or colored gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Youtube className="w-12 h-12 text-red-500 opacity-80" />
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-[10px] text-white font-bold">
                    {playlist.videoCount} Videos
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 rounded text-[10px] text-white font-bold uppercase">
                    {playlist.exam}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{playlist.channelName}</span>
                <h3 className="text-sm font-bold text-gray-100 line-clamp-2 min-h-[40px]">{playlist.title}</h3>

                <div className="mt-auto pt-2">
                    <a
                        href={playlistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/10 text-gray-300 text-sm font-medium hover:bg-red-600 hover:text-white transition-colors group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                    >
                        <PlayCircle className="w-4 h-4" /> Watch Now
                    </a>
                </div>
            </div>
        </GlassCard>
    );
}
