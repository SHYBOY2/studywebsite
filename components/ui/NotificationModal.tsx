
"use client";

import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    examName: string;
}

export function NotificationModal({ isOpen, onClose, examName }: NotificationModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, examName }),
            });

            if (!res.ok) throw new Error("Failed to subscribe");

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setEmail("");
            }, 2000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md relative"
                    >
                        <GlassCard className="p-6 border-blue-500/20 shadow-2xl bg-[#0f172a]/90">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 mx-auto">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-center text-white">Get Notified</h3>
                                <p className="text-gray-400 text-center text-sm mt-2">
                                    Receive instant updates for <span className="text-blue-300 font-medium">{examName}</span> directly in your inbox.
                                </p>
                            </div>

                            {success ? (
                                <div className="flex flex-col items-center justify-center py-6 text-green-400">
                                    <CheckCircle className="w-12 h-12 mb-2" />
                                    <p className="font-medium">Successfully Subscribed!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                                        />
                                    </div>

                                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
                                    </button>
                                </form>
                            )}
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
