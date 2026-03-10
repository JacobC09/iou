"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createContact } from "@/lib/server"
import { useAppContext } from "../App/AppContext"; 
import { useRouter } from "next/navigation";


export default function AddTransactionModal({ open, onClose }: {
    open: boolean, 
    onClose: () => void,
}) {
    const router = useRouter();
    const { profile } = useAppContext();
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const close = () => {
        setName("");
        onClose();
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        await createContact(profile!.id, name.trim());
        router.refresh();
        setSubmitting(false);
        close();
    }

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">New Friend</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500">Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} required className="rounded-xl" />
                    </div>

                    <Button type="submit" className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold" disabled={submitting}>
                        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Add Friend
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}