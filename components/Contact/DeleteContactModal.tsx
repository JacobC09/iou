"use client";

import { useState } from "react";
import { Loader2, UserX } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

export function DeleteContactModal({
    onDelete,
}: {
    onDelete: () => Promise<void>;
}) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                 <Button 
                    className="mt-4 w-full h-10 rounded-xl font-medium flex items-center gap-2 text-sm transition-colors text-red-500 hover:text-red-700 border-red-100 bg-red-50 hover:bg-red-100"
                >
                    <UserX className="w-4 h-4" />
                    Delete
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete contact?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action is permanent. This profile will be deleted but transactions will remain.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete Account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            <AlertDialogOverlay className="fixed inset-0 backdrop-blur-sm" />
        </AlertDialog>
    );
}