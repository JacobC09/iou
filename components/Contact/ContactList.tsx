"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAppContext } from "@/components/App/AppContext"; 
import { cn, getBalance, getRelatedTransactions } from "@/lib/utils";
import Contact from "./Contact";
import AddContactModal from "./AddContactModal";
import { searchArray } from "@/lib/sort";

    type SortMethod =  "recent" | "balance" | "alpha";
    type SortDirection = "desc" | "asc";

    export default function ContactList() {
        const { contacts: dbContacts, transactions } = useAppContext();
        const [search, setSearch] = useState("");
        const [sortMethod, setSortMethod] = useState<SortMethod>("recent");
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
                    className={cn(
                        "flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium",
                        active ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                    )}
                >
                    {label}
                    {active ? (
                        sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    ) : <ArrowUpDown className="w-3 h-3 opacity-40" />
                    }
                </button>
            );
        };

        const contacts = dbContacts.map(contact => ({
            net: getBalance(contact.owner, getRelatedTransactions(contact.owner, contact.link, transactions)).net,
            ...contact
        }));

        let sorted = Array.from({ length: contacts.length }, (_, index) => index);

        if (search) {
            const contactNames = contacts.map(c => c.name);
            const matchingNames = searchArray(contactNames, search, {
                caseSensitive: false,
                allWords: true,
                fuzzy: false
            });

            sorted = matchingNames.map((name) => contactNames.indexOf(name));
        }


        if (sortMethod == "balance") {
            sorted.sort((a, b) => contacts[b].net - contacts[a].net)
        } else if (sortMethod == "recent") {
            sorted.sort((a, b) => contacts[b].dateAccessed.getTime() - contacts[a].dateAccessed.getTime())
        } else if (sortMethod == "alpha") {
            sorted.sort((a, b) => contacts[a].name.localeCompare(contacts[b].name))
        }

        if (sortDir == "asc") {
            sorted.reverse();
        }

        return (
            <>

                <AddContactModal 
                    onSubmit={() => {
                        router.refresh();
                    }}
                />

                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search by person..." className="pl-9 bg-white rounded-xl" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex gap-2 shrink-0 overflow-x-auto items-center">
                        <SortBtn field="recent" label="Recent" />
                        <SortBtn field="balance" label="Balance" />
                        <SortBtn field="alpha" label="A-Z" />
                    </div>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="sync" initial={false}>
                        {contacts.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-slate-400 text-sm">
                                    No debts yet :D
                                </p>
                            </div>
                        ) : (
                            sorted.map((index) => {
                                const contact = contacts[index];
                                return <Contact key={contact.id} contact={contact} balance={contact.net} />
                            })
                        )}
                    </AnimatePresence>
                </div>
            </>
        );
    }
