"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, ChevronDown, ChevronUp, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { format } from "date-fns"
import { useState } from "react";
import { contactTable, transactionTable } from "@/lib/schema";
import { cn, getTransactionType } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "@/lib/server";

type FilterType = "all" | "liability" | "payment"
type SortMethod = "date" | "amount" | "type"
type SortDir = "asc" | "desc"

export default function TransactionHistory({ contact, transactions }: {
    contact: typeof contactTable.$inferSelect,
    transactions: typeof transactionTable.$inferSelect[]
}) {
    const router = useRouter();
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [sortMethod, setSortMethod] = useState<SortMethod>("date")
    const [sortDir, setSortDir] = useState<SortDir>("desc")

    const toggleSort = (field: SortMethod) => {
        if (sortMethod == field) {
            setSortDir(sortDir == "asc" ? "desc" : "asc");
        } else {
            setSortMethod(field);
            setSortDir("desc");
        }
    };

    const SortBtn = ({ field, label }: { field: SortMethod, label: string }) => {
        const active = sortMethod === field;

        return (
            <button
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${active ? "bg-slate-800 text-white" : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"}`}
            >
                {label}
                {active ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
                    : <ArrowUpDown className="w-3 h-3 opacity-40" />}
            </button>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    History <span className="text-slate-300 font-normal normal-case">({transactions.length})</span>
                </h2>
                <div className="flex gap-1.5 flex-wrap">
                    {/* {["all", "liability", "payment"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterType(f as FilterType)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors capitalize ${filterType === f ? "bg-indigo-100 text-indigo-700" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {f}
                        </button>
                    ))}
                    <div className="w-px bg-slate-100 mx-0.5" />
                    <SortBtn field="date" label="Date" />
                    <SortBtn field="amount" label="Amount" />
                    <SortBtn field="type" label="Type" /> */}
                </div>
            </div>
            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {transactions.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No transactions yet</p>
                    ) : (
                        transactions.toReversed().map(t => {
                            const type = getTransactionType(contact.link, t);
                            const isPayment = ["i_paid", "they_paid"].includes(type);
                            const positive = ["i_paid", "they_owe"].includes(type);
                            
                            let to, from;
                            if (type.charAt(0) == "i") {
                                from = "You";
                                to = contact.name;
                            } else {
                                from = contact.name;
                                to = "you";
                            }

                            let iconStyle = cn(
                                "w-4 h-4 text-${color}-600",
                                type == "i_paid" && "text-indigo-400",
                                type == "they_paid" && "text-fuchsia-500",
                                type == "i_owe" && "text-orange-400",
                                type == "they_owe" && "text-emerald-400",
                            );

                            return (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    layout
                                    className={cn(
                                        "flex items-center gap-3 rounded-2xl px-4 py-4 bg-slate-50 border border-slate-100 group",
                                        type == "i_owe" && `border-orange-300 bg-orange-50`,
                                        type == "they_owe" && `border-emerald-300 bg-emerald-50`,
                                    )}
                                >
                                    <div className={cn(
                                        `w-9 h-9 rounded-xl flex items-center justify-center shrink-0`,
                                        type == "i_paid" && "bg-indigo-100",
                                        type == "they_paid" && "bg-fuchsia-200",
                                        type == "i_owe" && "bg-orange-100",
                                        type == "they_owe" && "bg-emerald-100",
                                    )}>
                                        {positive ? <TrendingUp className={iconStyle} /> : <TrendingDown className={iconStyle} />}
                                    </div>


                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <p className="text-sm text-slate-500 font-medium truncate">
                                            <span className={cn(
                                                "font-bold",
                                                type == "i_paid" && "text-indigo-400",
                                                type == "they_paid" && "text-fuchsia-400",
                                                type == "i_owe" && "text-orange-400",
                                                type == "they_owe" && "text-emerald-400",
                                            )}>{from}</span> <span className="text-slate-500">{isPayment ? "paid" : (from == "You" ? "owe" : "owes")}</span> {to}
                                        </p>
                                        {<p className="text-md text-slate-800 font-medium truncate">{t.description}</p>}
                                        <div className="flex gap-3 items-center text-xs text-slate-400">
                                            {format(new Date(t.created_at!), "MMM d, yyyy")}
                                            {contact.real &&
                                                <span className="ml-1.5 px-1.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-400">
                                                    Added by <span className="font-bold text-slate-500">You</span>
                                                </span>
                                            }
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={cn(
                                            "font-bold text-md tabular-nums text-slate-400",
                                            type == "i_owe" && "text-orange-500",
                                            type == "they_owe" && "text-emerald-500",
                                        )}>
                                            {positive ? "+" : "-"}${(t.amount / 100).toFixed(2)}
                                        </span>
                                        <button
                                            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={async () => {
                                                await deleteTransaction(t.id);
                                                router.refresh();
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>

    );
}