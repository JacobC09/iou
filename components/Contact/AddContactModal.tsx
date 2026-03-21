"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { createContact } from "@/lib/server"
import { useAppContext } from "../App/AppContext";
import { motion } from "framer-motion";

export default function AddContactModal({ onSubmit }: {
    onSubmit: () => void,
}) {
    const { profile, contacts, set } = useAppContext();
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        const contact = await createContact(profile!.id, name.trim());
        set({ contacts: [...contacts, contact] })
        setSubmitting(false);
        setName("");
        onSubmit();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={(state) => {
            setOpen(state);
            setName("");
        }}>
            <DialogTrigger asChild>
                <motion.button
                    className="mb-5 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 font-semibold py-3 rounded-2xl shadow-sm hover:bg-slate-50 hover:shadow-md transition-all text-sm"
                    whileTap={{ scale: 0.98 }}

                >
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white" />
                    </div>
                    Add Contact
                </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">New Contact</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} required className="rounded-xl" />
                    </div>

                    <Button type="submit" className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold" disabled={submitting}>
                        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Add Contact
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}