"use client";

import AddTransactionForm from "@/components/App/AddTransactionForm";
import { useAppContext } from "@/components/App/AppContext";
import Counter from "@/components/App/Counter";
import ProfileSettings from "@/components/App/ProfileSettings";
import TransactionHistory from "@/components/App/TransactionHistory";
import { colorFromStr, getBalance, getInitials, getRelatedTransactions } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { use } from "react";

export default function Profile({ params }: {
    params: Promise<{ id: string }>
}) {
    const id = parseInt(decodeURIComponent(use(params).id));
    
    const { contacts, transactions } = useAppContext();
    const contact = contacts.find(c => c.id === id);

    if (!contact) {
        redirect("/")
    }

    const related = getRelatedTransactions(contact.owner, contact.link, transactions);
    const { net, totalOwed, totalIOwe } = getBalance(contact.owner, related);
    const initials = getInitials(contact.name);
    const color = contact.color ?? colorFromStr(contact.name);
    const email = null;
    const isPositive = net >= 0;
    

    return (
        <div className="space-y-5">
            <button
                onClick={() => redirect("/app")}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="relative overflow-hidden rounded-3xl px-6 pt-7 pb-6" style={{ background: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)" }}>
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-25" style={{ background: isPositive ? "#10b981" : "#f97316" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ background: "#6366f1" }} />

                <div className="relative z-10 flex items-start gap-5">
                    <div className="relative shrink-0">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl border-2 border-white/20 overflow-hidden"
                            style={{ background: color }}
                        >
                            {initials}
                        </div>
                    </div>

                    <div className="w-full space-y-3" style={{gridTemplateRows: "auto 1fr"}}>
                        <div>
                            <h1 className="text-xl font-black text-white truncate">{contact.name}</h1>
                            {email && <p className="text-xs text-slate-400 truncate">{email}</p>}
                        </div>

                        <div className="sm:text-right sm:absolute right-0 top-0">
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Net</p>
                            <Counter total={net} className={`text-3xl font-black tabular-nums ${isPositive ? "text-emerald-400" : "text-orange-400"}`} />
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                <span className="text-slate-300 text-xs">You owe</span>
                                <span className="text-orange-300 font-bold text-sm">${totalIOwe.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="text-slate-300 text-xs">Owed to you</span>
                                <span className="text-emerald-300 font-bold text-sm">${totalOwed.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <AddTransactionForm contact={contact} />
            <ProfileSettings contact={contact} email={email} color={color} />
            <TransactionHistory contact={contact} transactions={related} />
            
        </div>
    );
}