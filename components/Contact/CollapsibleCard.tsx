"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

export default function CollapsibleCard({ title, defaultOpen, danger, children }: {
    title: string,
    defaultOpen: boolean,
    danger: boolean,
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={cn(
            "bg-white rounded-3xl border border-slate-100 shadow-sm",
            danger && "border-red-100"
        )}>
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5">
                <h2 className={cn(
                    "text-sm font-semibold text-slate-500 uppercase tracking-wider",
                )}>{title}</h2>
                {open
                    ? <ChevronUp className={`w-4 h-4 ${danger ? "text-red-300" : "text-slate-400"}`} />
                    : <ChevronDown className={`w-4 h-4 ${danger ? "text-red-300" : "text-slate-400"}`} />}
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden "
                    >
                        <div className="px-6 pb-5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}