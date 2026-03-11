"use client";

import { motion } from "framer-motion";
import { getBalance } from "@/lib/utils";
import { useAppContext } from "./AppContext";
import Counter from "./Counter";


export default function HeroHeader() {
    const { transactions, profile } = useAppContext();

    const { net, totalOwed, totalIOwe } = getBalance(profile!.id, transactions)
    const inTheGreen = net >= 0;
    
    return (
        <div className="mb-3">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 pt-8 pb-6">
                <div
                    className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-30 blur-3xl"
                    style={{ background: inTheGreen ? "#10b981" : "#f97316" }}
                />
                <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: "#6366f1" }} />

                <motion.div
                    className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
                    style={{ background: inTheGreen ? "#10b981" : "#f97316" }}
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full opacity-10"
                    style={{ background: inTheGreen ? "#34d399" : "#fb923c" }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/4 w-80 h-80 rounded-full opacity-5"
                    style={{ background: "#6366f1" }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />

                <div className="relative z-10">
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Net Balance</p>
                    <Counter total={net} className={`text-5xl sm:text-6xl font-black tabular-nums ${inTheGreen ? "text-emerald-400" : "text-orange-400"}`} />
                    <p className="text-slate-500 text-sm mt-1.5">
                        {inTheGreen ? "People owe you more than you owe" : "You owe more than you're owed"}
                    </p>

                    <div className="flex gap-3 mt-5 flex-wrap">
                        <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400" />
                            <span className="text-slate-400 text-xs">You owe</span>
                            <span className="text-orange-300 font-bold text-sm">${totalOwed.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-slate-400 text-xs">Owed to you</span>
                            <span className="text-emerald-300 font-bold text-sm">${totalIOwe.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}