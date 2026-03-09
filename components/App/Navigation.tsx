"use client";

import { BarChart2, User } from "lucide-react";
import { logout } from "@/lib/auth";
import { useAppContext } from "./AppContext"; 

export default function Navigation() {
    const { user } = useAppContext();

    return (
        <div className="flex items-center justify-between mb-5">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    ledger<span className="text-indigo-500">.</span>
                </h1>
                <p className="text-md text-slate-400 mt-0.5">Hey {user.name}</p>
            </div>
            <div className="flex items-center gap-2">
                <a>
                    <button className="w-9 h-9 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm">
                        <BarChart2 className="w-4 h-4 text-slate-500" />
                    </button>
                </a>
                <a>
                    <button 
                        className="w-9 h-9 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
                        onClick={async () => await logout()}
                    >
                        <User className="w-4 h-4 text-slate-500" />
                    </button>
                </a>
            </div>
        </div>
    );
}