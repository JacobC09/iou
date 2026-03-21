"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/components/App/AppContext";
import { getInitials } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { updateUser } from "@/lib/server";
import Link from "next/link";

export default function Account() {
    const { user } = useAppContext();
    const [name, setName] = useState(user.name ?? "");
    const [email, setEmail] = useState(user.email ?? "");
    const [saving, setSaving] = useState(false);
    const initials = getInitials(user.name!);
    
    const saveProfile = async () => {
        setSaving(true);
        await updateUser(user.id, name, email);
        setSaving(false);
    }

    return (
        <div className="space-y-5 pb-[10vh]">
            <Link href="/app" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 mb-8">Account</h1>
            <div className="space-y-5">
                <motion.div 
                    initial={{ opacity: 0, y: 16 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-slate-700 mb-5">Profile Photo</h2>
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <p className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center overflow-hidden">
                                {initials}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">{user?.name}</p>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 16 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.08 }} 
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5"
                >
                    <h2 className="text-sm font-semibold text-slate-700">Personal Info</h2>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Full Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Email</Label>
                        <Input value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <Button onClick={saveProfile} disabled={saving} className="w-full h-10 rounded-xl font-semibold text-sm transition-all">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium py-3 rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors"
                        onClick={async () => await logout()}
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </motion.div>
            </div>
        </div>
    );
}