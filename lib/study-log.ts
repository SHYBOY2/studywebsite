"use client";

// Simple local storage wrapper for study logs
const STORAGE_KEY = 'study_logs';

export interface StudySession {
    id: string;
    date: string; // ISO Date String YYYY-MM-DD
    minutes: number;
    timestamp: number;
}

export const StudyLog = {
    getSessions: (): StudySession[] => {
        if (typeof window === 'undefined') return [];
        try {
            const item = localStorage.getItem(STORAGE_KEY);
            return item ? JSON.parse(item) : [];
        } catch {
            return [];
        }
    },

    addSession: (minutes: number) => {
        const sessions = StudyLog.getSessions();
        const now = new Date();
        const newSession: StudySession = {
            id: crypto.randomUUID(),
            date: now.toISOString().split('T')[0],
            minutes: minutes,
            timestamp: now.getTime(),
        };
        sessions.push(newSession);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        return newSession;
    },

    getTodayTotal: (): number => {
        const sessions = StudyLog.getSessions();
        const today = new Date().toISOString().split('T')[0];
        return sessions
            .filter(s => s.date === today)
            .reduce((acc, curr) => acc + curr.minutes, 0);
    },

    getDailyStats: (): Record<string, number> => {
        const sessions = StudyLog.getSessions();
        return sessions.reduce((acc, curr) => {
            acc[curr.date] = (acc[curr.date] || 0) + curr.minutes;
            return acc;
        }, {} as Record<string, number>);
    }
};
