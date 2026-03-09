"use client";

import { contactTable } from "@/lib/schema";
import { colorFromStr, getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation"

export default function Contact({ contact, balance }: {
    contact: typeof contactTable.$inferSelect,
    balance: number,
}) {
    const lastUpdated = "Mar 5, 2026";
    const positive = balance >= 0;
    const color = contact.color ?? colorFromStr(contact.name)
    const initials = getInitials(contact.name)

    const textColor = balance == 0 ? "slate-400" : (balance > 0 ? "emerald-600" : "orange-600")
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            layout
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => redirect(`/app/profile/${encodeURIComponent(contact.id)}`)}
        >
            <div className="flex items-center gap-3 px-4 py-4">
                <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden border-2"
                    style={{ background: color, borderColor: `${color}44` }}
                >
                    {initials}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-slate-900">{contact.name}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{lastUpdated}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-bold text-base tabular-nums text-${textColor}`}>
                        {positive ? "+" : ""}${balance.toFixed(2)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
            </div>
        </motion.div>
    );
}