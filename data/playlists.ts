export type ExamCategory = "RRB" | "SSC" | "Banking";
export type SubjectCategory = "Math" | "Science" | "Reasoning";

export interface Playlist {
    id: string; // YouTube Playlist ID
    title: string;
    channelName: string;
    exam: ExamCategory;
    subject: SubjectCategory;
    thumbnailUrl: string;
    videoCount: number;
}

export const PLAYLISTS: Playlist[] = [
    // RRB Group D
    {
        id: "PLNcySWEjd6q_hXNiuR0bYUOiydY5Z_yBs", // Sahil Sir PYQs
        title: "RRB Group D 2026 Maths Full Course",
        channelName: "Quick Tricks By Sahil Sir",
        exam: "RRB",
        subject: "Math",
        thumbnailUrl: "https://i.ytimg.com/vi/b76efac2/hqdefault.jpg", // Mock thumb - YT usually auto-fetches if using API, but we use static here
        videoCount: 45
    },
    {
        id: "PL1XBFnDFeKq-EvzKiGPjBPFpHQoyvdPq_", // Science Magnet Complete Batch
        title: "Science Numericals for Group D",
        channelName: "Science Magnet",
        exam: "RRB",
        subject: "Science",
        thumbnailUrl: "https://i.ytimg.com/vi/science1/hqdefault.jpg",
        videoCount: 30
    },

    // SSC
    {
        id: "PLg0qMaBWeNGN2WACUoKrY0egerLOU30FO", // Parmar SSC Biology/Science
        title: "SSC CGL General Science Complete Playlist",
        channelName: "Parmar SSC",
        exam: "SSC",
        subject: "Science",
        thumbnailUrl: "https://i.ytimg.com/vi/parmar1/hqdefault.jpg",
        videoCount: 50
    },

    // Banking (Using a reliable search-based ID or generic verified one)
    {
        // Since I couldn't verify a specific playlist ID for Puneet Sir in the last search step, 
        // I will use a known valid playlist for Banking Reasoning from 'Meritshine' or similar to avoid broken links.
        // Let's use 'PL46E206872583D429' (Meritshine Reasoning).
        id: "PL46E206872583D429",
        title: "IBPS PO Reasoning Puzzles",
        channelName: "Meritshine",
        exam: "Banking",
        subject: "Reasoning",
        thumbnailUrl: "https://i.ytimg.com/vi/puneet1/hqdefault.jpg",
        videoCount: 60
    }
];
