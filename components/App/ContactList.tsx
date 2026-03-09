"use client";

import { AnimatePresence } from "framer-motion";
import Contact from "./Contact";
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAppContext } from "./AppContext"; 
import { getBalance, getRelatedTransactions } from "@/lib/utils";

type SortMethod = "net" | "name" | "frequency" | "recent";
type SortDirection = "desc" | "asc";

export default function ContactView() {
    const { contacts, transactions } = useAppContext();
    const [search, setSearch] = useState("");
    const [sortMethod, setSortMethod] = useState<SortMethod>("net");
    const [sortDir, setSortDir] = useState<SortDirection>("desc");

    const toggleSort = (field: SortMethod) => {
        if (sortMethod === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortMethod(field);
            setSortDir("desc");
        }
    };

    const SortBtn = ({ field, label }: { field: SortMethod, label: string }) => {
        const active = sortMethod == field;

        return (
            <button
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${active ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"}`}
            >
                {label}
                {active ? (
                    sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                ) : <ArrowUpDown className="w-3 h-3 opacity-40" />
                }
            </button>
        );
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search by person..." className="pl-9 bg-white rounded-xl" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 shrink-0 overflow-x-auto items-center">
                    <SortBtn field="recent" label="Recent" />
                    <SortBtn field="net" label="Amount" />
                    <SortBtn field="name" label="A-Z" />
                    <SortBtn field="frequency" label="Freq" />
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {contacts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-sm">
                                "No debts yet — you're all clear! 🎉
                            </p>
                        </div>
                    ) : (
                        contacts.map((contact, key) => {
                            const { net } = getBalance(contact.owner, getRelatedTransactions(contact.owner, contact.link, transactions))
                            return <Contact key={key} contact={contact} balance={net} />
                        })
                    )
                    }
                </AnimatePresence>
            </div>
        </>
    );
}