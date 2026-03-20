"use client";

import { contactTable } from "@/lib/schema";
import { updateRecent } from "@/lib/server";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Contact({ contact, balance }: {
    contact: typeof contactTable.$inferSelect,
    balance: number,
}) {
    const router = useRouter();
    const positive = balance >= 0;
    const color = contact.color ?? "#ffffff"
    const initials = getInitials(contact.name)
    const textColor = balance == 0 ? "slate-400" : (balance > 0 ? "emerald-600" : "orange-600")
    
    const onClick = async () => {
        await updateRecent(contact.id);
        router.refresh();
    }

    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <Link onClick={onClick} href={`/app/contact/${encodeURIComponent(contact.id)}`}>
                <div className="flex items-center gap-3 px-4 py-4">
                    <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden border-2"
                        style={{ background: color, borderColor: `${color}44` }}
                    >
                        {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg text-slate-900">{contact.name}</p>
                        <p className="text-xs text-slate-300 mt-0.5">{format(contact.lastUpdated, "MMM d, yyyy")}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`font-bold text-base tabular-nums text-${textColor}`}>
                            {positive ? "+" : ""}${balance.toFixed(2)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}