"use client";

import { cn, TransactionType } from "@/lib/utils";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";
import { contactTable } from "@/lib/schema";
import { useAppContext } from "./AppContext";
import { addTransaction, updateLastUpdated } from "@/lib/server";
import { useRouter } from "next/navigation";

const TYPES = [
    { id: "they_owe", label: "They owe me", sublabel: "Liability", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300" },
    { id: "i_owe", label: "I owe them", sublabel: "Liability", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300" },
    { id: "they_paid", label: "They paid me", sublabel: "Payment", color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-300" },
    { id: "i_paid", label: "I paid them", sublabel: "Payment", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-300" },
]

export default function AddTransactionForm({ contact }: {
    contact: typeof contactTable.$inferSelect
}) {
    const { profile } = useAppContext();
    const router = useRouter();
    const [transactionType, setTransactionType] = useState<TransactionType>("they_owe")
    const [submitting, setSubmitting] = useState(false);
    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");
    const [successful, setSuccessful] = useState(false);

    const submit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitting(false);

        const me = transactionType.charAt(0) == "i";
        const type = transactionType.endsWith("owe") ? "owes" : "paid";
        const from = me ? contact.link : profile.id;
        const to = me ? profile.id : contact.link;

        const cents: number = Math.round(parseFloat(amount) * 100);
        await addTransaction(from, to, type, cents, desc);
        await updateLastUpdated(contact.id);
        router.refresh();
        setSuccessful(true);
        setTimeout(() => setSuccessful(false), 800)
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">New Transaction</h2>
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {TYPES.map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTransactionType(t.id as TransactionType)}
                            className={cn(
                                "text-left rounded-2xl border-2 px-3 py-2.5 transition-all",
                                transactionType === t.id ? `${t.bg} ${t.border}` : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                            )}
                        >
                            <p className={cn(
                                "font-semibold text-sm",
                                transactionType === t.id ? t.color : "text-slate-700"
                            )}>{t.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{t.sublabel}</p>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-1">
                        <Label className="text-xs text-slate-400">Amount *</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                            <Input
                                type="number" step="0.01" min="0.01" placeholder="0.00"
                                className="pl-7 rounded-xl h-9 text-sm" value={amount}
                                onChange={e => setAmount(e.target.value)} required
                            />
                        </div>
                    </div>
                    <div className="flex-2 space-y-1">
                        <Label className="text-xs text-slate-400">Note</Label>
                        <Input
                            placeholder="Dinner, rent, groceries..."
                            value={desc} onChange={e => setDesc(e.target.value)}
                            className="rounded-xl h-9 text-sm"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={submitting }
                    className={cn(
                        "w-full h-10 rounded-xl font-semibold text-sm transition-all", 
                        successful ? "bg-emerald-600 hover:bg-emerald-600 opacity-80" : "bg-slate-900 hover:bg-slate-800"
                    )}
                >
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        : successful ? <><Check className="w-4 h-4 mr-2" /> Added!</>
                            : "Add Transaction"
                    }
                </Button>
            </form>
        </div>
    );
}