"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { COLORS } from "@/lib/utils";
import { updateContactSettings } from "@/lib/server";
import { useRouter } from "next/navigation";
import { contactTable } from "@/lib/schema";

export default function ContactSettings({ contact, ...props }: {
    contact: typeof contactTable.$inferSelect,
    color: string,
    email: string | null,
}) {
    const router = useRouter();
    const [name, setName] = useState(contact.name);
    const [color, setColor] = useState(props.color);
    const [saving, setSaving] = useState(false);
    // const [email, setEmail] = useState(props.email);

    const update = async () => {
        setSaving(true);
        await updateContactSettings(contact.id, name, color);
        router.refresh();
        setSaving(false);
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Profile</h2>
            <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Display Name</Label>
                    <Input value={name} onChange={e => { setName(e.target.value); }} className="rounded-xl h-9 text-sm" />
                </div>
                {/* <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Email</Label>
                    {email == null ? (
                            <Input disabled className="rounded-xl h-9 text-sm text-slate-400" />
                        ) : (
                            <Input value={email} onChange={e => { setEmail(e.target.value) }} disabled className="rounded-xl h-9 text-sm text-slate-400" />
                        )
                    }
                </div> */}
            </div>
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Avatar Color</Label>
                <div className="flex gap-2 flex-wrap">
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => { setColor(c); }}
                            className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                            style={{ background: c, borderColor: color === c ? "#fff" : c, outline: color === c ? `2px solid ${c}` : "none" }}
                        />
                    ))}
                </div>
            </div>
            <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Button onClick={update} disabled={saving} className="w-full h-10 rounded-xl font-semibold text-sm transition-all">
                        {saving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : "Save Profile"}
                    </Button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}