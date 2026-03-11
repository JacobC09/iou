"use client";

import { User } from "lucide-react";
import { useAppContext } from "./AppContext"; 
import { usePathname } from "next/navigation"

export default function Navigation() {
    const { user } = useAppContext();
    const path = usePathname();
    const settingsPath = "/app/settings";

    return (
        <div className="flex items-center justify-between mb-5">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    ledger<span className="text-indigo-500">.</span>
                </h1>
                <p className="text-md text-slate-400 mt-0.5">Hey <span className="text-slate-500 font-medium">{user.name}</span></p>
            </div>
            <div className="flex items-center gap-2">
                {/* <a>
                    <button className="w-9 h-9 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm">
                        <BarChart2 className="w-4 h-4 text-slate-500" />
                    </button>
                </a> */}
                {path != settingsPath &&
                    <a href={settingsPath}>
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                            Settings
                            <div 
                                className="w-9 h-9 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
                            >
                                <User className="w-4 h-4 text-slate-500" />
                            </div>
                        </div>
                    </a>
                }
            </div>
        </div>
    );
}