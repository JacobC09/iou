"use client";

import chat, { ChatResult } from "@/lib/chat";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, Info, Loader2, Send, Sparkles, TrendingDown, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "./AppContext";
import { cn, TransactionType } from "@/lib/utils";
import { Button } from "../ui/button";
import { addTransaction, createContact } from "@/lib/server";

function Transaction({ res, updateDesc }: {
    res: ChatResult,
    updateDesc: (desc: string) => void
}) {
    if (!res.transaction) return null;

    let type: TransactionType;
    if (res.transaction.type == "paid") {
        type = res.transaction.from === null ? "i_paid" : "they_paid";
    } else {
        type = res.transaction.from === null ? "i_owe" : "they_owe";
    }
    const isPayment = ["i_paid", "they_paid"].includes(type);
    const positive = ["i_paid", "they_owe"].includes(type);
    const contact = res.transaction.to ?? res.transaction.from;

    let to, from;
    if (type.charAt(0) == "i") {
        from = "You";
        to = contact;
    } else {
        from = contact;
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
                <input 
                    className="text-md text-slate-800 font-medium truncate"
                    value={res.transaction.description}
                    onChange={(e) => updateDesc(e.currentTarget.value)}
                    type="text"
                />
                
            </div>

            <div className="flex items-center gap-2 shrink-0 mr-2">
                <span className={cn(
                    "font-bold text-md tabular-nums text-slate-400",
                    type == "i_owe" && "text-orange-500",
                    type == "they_owe" && "text-emerald-500",
                )}>
                    {positive ? "+" : "-"}${(res.transaction.amount / 100).toFixed(2)}
                </span>
            </div>
        </motion.div>
    );
}

export default function Chat() {
    const { profile, contacts, set, transactions } = useAppContext();

    const [input, setInput] = useState("")
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | ChatResult>(null);
    const [addContact, setAddContact] = useState(false);

    const names = contacts.map((c) => c.name);

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const res = await chat(input, names);
        setLoading(false);
        const name = res.transaction?.to || res.transaction?.from;
   
        if (!name) return;
        if (res) setResult(res)
        
        setAddContact(!names.includes(name.trim()));
    }

    const confirm = async () => {
        if (!result?.transaction) return;

        const name = result?.transaction?.to || result?.transaction?.from;
        if (!name) return;

        let contact;
        if (addContact) {
            contact = await createContact(profile.id, name);
        } else {
            contact = contacts.find((c) => c.name == name.trim());
        }
        
        if (!contact) return;

        const transaction = await addTransaction(
            result.transaction.from ? contact.link : profile.id,
            result.transaction.to ? contact.link : profile.id,
            result.transaction.type,
            result.transaction.amount,
            result.transaction.description
        );
        
        if (addContact) {
            set({ contacts: [...contacts, contact], transactions: [...transactions, transaction] })
        } else {
            set({ transactions: [...transactions, transaction] })
        }

        setResult(null);
        setInput("");
    }

    return (
        <div className="mb-5">
            <form onSubmit={onSubmit}>
                <div className={`relative flex items-center gap-2 bg-white border rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${focused ? "border-indigo-300 ring-2 ring-indigo-100 shadow-md" : "border-slate-200"}`}>
                    <div className="shrink-0 w-7 h-7 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        {loading
                            ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                            : <Sparkles className="w-3.5 h-3.5 text-white" />
                        }
                    </div>

                    <input
                        type="text"
                        value={input ?? ""}
                        onChange={e => setInput(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => { if (!input) setFocused(false); }}
                        placeholder="Describe a transaction"
                        className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none min-w-0"
                    />

                    <AnimatePresence>
                        {input && (
                            <motion.div
                                className="flex items-center gap-1 shrink-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <button
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                    type="button"
                                    onClick={() => setInput("")}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    className="w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-colors disabled:opacity-60"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <Send className="w-3.5 h-3.5 text-white" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>

            <AnimatePresence>
                {result?.transaction && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                            <div className="size-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Check className="size-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Input understood</span>
                        </div>
                        <div className="p-4 space-y-4">
                            <Transaction res={result} updateDesc={(desc: string) => setResult({...result, transaction: {...result.transaction!, description: desc}})} />
                            {addContact && <p className="text-slate-400 italic text-base">Contact not found, it will be added on confirmation</p>}
                            <div className="flex gap-4 ">
                                <Button onClick={confirm}>Confirm</Button>
                                <Button variant="outline" onClick={() => setResult({ ...result, transaction: undefined })}>Edit</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {result?.transaction?.suggestions?.length && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-100">
                            <div className="size-6 rounded-lg bg-slate-200 flex items-center justify-center">
                                <Info className="size-4 text-slate-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Suggestions</span>
                        </div>
                        <div className="p-4 space-y-4">
                            <ul className="space-y-1 mb-4">
                                {result?.transaction.suggestions.map((s, i) => (
                                    <li key={i} className="text-slate-600 flex items-center gap-4 ml-4">
                                        <span className="w-1.5 h-1.5  rounded-full bg-slate-300 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant="outline"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {result?.error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-sm mt-5 bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm"
                    >
                        <div className="p-4 border-b border-red-50 flex items-center gap-2 bg-red-50/50">
                            <div className="size-6 rounded-lg bg-red-100 flex items-center justify-center">
                                <AlertCircle className="size-4 text-red-500" />
                            </div>
                            <span className="font-semibold text-red-700">Could not parse input</span>
                        </div>
                        <div className="p-4">
                            <p className="text-slate-500 mb-1">{result?.error.message}</p>
                            <ul className="space-y-1 mb-4">
                                {result?.error.suggestions.map((s, i) => (
                                    <li key={i} className="text-slate-600 flex items-center gap-4 ml-4">
                                        <span className="w-1.5 h-1.5  rounded-full bg-slate-300 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                onClick={() => setResult({ ...result, error: undefined })}
                                variant="outline"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}