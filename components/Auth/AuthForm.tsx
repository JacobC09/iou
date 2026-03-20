"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, ArrowRight, EyeOff, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { login, signup, userExists } from "@/lib/auth";
import Link from "next/link";


const InputField = (props: React.ComponentProps<"input">) => {
    return (
        <input
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
            {...props}
        />
    );
}

const PasswordInputField = (props: React.ComponentProps<"input">) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <InputField {...props} type={showPassword ? "text" : "password"} />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
};

export default function AuthForm() {
    const [formValid, setFormValid] = useState(false);
    const [hasAccount, setHasAccount] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formRef = useRef<HTMLFormElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);

    const valididateForm = () => {
        const form = formRef.current;
        if (!form) return;
        const inputs = Array.from(form.querySelectorAll("input"));
        let valid = inputs.every(input => input.value.trim() !== "");
        setFormValid(valid);
    }

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        let data = new FormData(e.currentTarget);
        let email = data.get("email");

        if (hasAccount === null) {
            if (!email) {
                setLoading(false);
                setError("Invalid Email");
                return;
            }

            const valid = await userExists((email as string).toLowerCase());
            setHasAccount(valid);
        } else if (hasAccount === false) {
            let name = data.get("name");
            let password = data.get("password");
            let confirmation = data.get("confirm-password");

            if (password != confirmation) {
                setError("Passwords do not match");
                setLoading(false);
                setFormValid(false);
                return;
            }

            const res = await signup((email as string).toLowerCase(), name as string, password as string);

            if (!res.success) {
                setError(res.error);
            }
        } else if (hasAccount) {
            let password = data.get("password");
            const res = await login((email as string).toLowerCase(), password as string);
            if (!res.success) {
                setError(res.error);
            }
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden pb-[5vh]">
            <motion.div
                className="absolute top-0 right-0 w-150 h-150 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-100 h-100 bg-slate-100 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <motion.div
                className="relative z-10 w-full max-w-sm"
                layout="position"
                transition={{ layout: {duration: 0.2, ease: "easeOut"}}}    
            >
                <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors text-xs mb-8">
                    <ArrowLeft className="w-3 h-3" />
                    Back to home
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        ledger<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Track what's yours</p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 16}}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Welcome</h2>

                        <form ref={formRef} onSubmit={onSubmit} onChange={valididateForm} className="space-y-4">
                            <Label>Email</Label>
                            <InputField
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                autoFocus
                            />
 
                            {hasAccount !== null && <motion.div
                                className="h-px bg-slate-100 mb-6 mt-3"
                                animate={{
                                    width: [0, "100%"]
                                }}
                            />}

                            {/* Login */}
                            {hasAccount &&
                                <>

                                    <motion.div
                                        initial={{ x: "-10px" }}
                                        animate={{ x: 0 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        className="space-y-4"
                                    >

                                        <Label>Password</Label>
                                        <PasswordInputField
                                            name="password"
                                            type="password"
                                            required
                                            autoFocus
                                        />
                                    </motion.div>
                                </>
                            }

                            {/* Signup */}
                            {hasAccount == false &&
                                <>
                                    <motion.div
                                        initial={{ x: "-10px" }}
                                        animate={{ x: 0 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        className="space-y-4"
                                    >

                                        <Label>Name</Label>
                                        <InputField
                                            name="name"
                                            type="text"
                                            required
                                            autoFocus
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: "-10px" }}
                                        animate={{ x: 0 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.05 }}
                                        className="space-y-4"
                                    >

                                        <Label>Password</Label>
                                        <PasswordInputField
                                            ref={passwordRef}
                                            name="password"
                                            type="password"
                                            required
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: "-10px" }}
                                        animate={{ x: 0 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                                        className="space-y-4"
                                    >

                                        <Label>Confirm Password</Label>
                                        <InputField
                                            ref={confirmRef}
                                            name="confirm-password"
                                            type="password"
                                            required
                                        />
                                    </motion.div>
                                </>
                            }

                            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                            <motion.button
                                type="submit"
                                disabled={loading || !formValid}
                                whileTap={{ scale: 0.98 }}
                                className="mt-6 w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <div style={{ opacity: loading ? 0 : 100 }} className="flex items-center gap-2">
                                    {hasAccount == null ? "Continue" : (
                                        hasAccount ? "Login" : "Sign Up"
                                    )
                                    }
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                {loading && <Loader2 className="w-4 h-4 animate-spin absolute" />}
                            </motion.button>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}