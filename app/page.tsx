"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Shield } from "lucide-react";
import Counter from "@/components/App/Counter";
import Link from "next/link";

export default function Landing() {
    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
            <nav className="flex items-center justify-between px-6 sm:px-16 pt-8 pb-4 max-w-6xl mx-auto">
                <span className="text-2xl font-black tracking-tight">
                    ledger<span className="text-indigo-500">.</span>
                </span>
                <Link href="/auth">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Sign in →
                    </motion.button>
                </Link>
            </nav>

            <section className="max-w-6xl mx-auto px-6 sm:px-16 pt-24 pb-32 grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs text-indigo-600 font-semibold mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Personal finance, simplified
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-slate-900">
                        Know exactly
                        <span className="relative inline-block">
                            <span className="relative z-10 text-indigo-600">who owes who.</span>
                            <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-3 bg-indigo-100 rounded-full z-0"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            />
                        </span>
                    </h1>

                    <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md">
                        A shared ledger between you and your contacts. Track liabilities, record payments, and always know your net balance — no more awkward "do you remember that thing?" moments.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Link href="/auth">
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(99,102,241,0.3)" }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg"
                            >
                                Get started free
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                        <p className="text-xs text-slate-400 self-center">Free forever · No credit card</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="relative">
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Net Balance</p>
                                    <Counter  total={247.50} className="text-4xl font-black text-emerald-600" />
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                            {[
                                { name: "Alex Chen", amount: "+$120", color: "#6366f1", tag: "owes you" },
                                { name: "Sam Rivera", amount: "+$80", color: "#10b981", tag: "owes you" },
                                { name: "Jordan Lee", amount: "-$47.50", color: "#f97316", tag: "you owe" },
                            ].map((p, i) => (
                                <motion.div
                                    key={p.name}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.15 }}
                                    className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                                >
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: p.color }}>
                                        {p.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                                        <p className="text-xs text-slate-400">{p.tag}</p>
                                    </div>
                                    <span className={`font-bold text-sm ${p.amount.startsWith("+") ? "text-emerald-600" : "text-orange-600"}`}>{p.amount}</span>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-5 -right-5 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg"
                        >
                            Synced in real-time ✓
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -bottom-4 -left-4 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-full shadow-md"
                        >
                            🎉 Balance settled with Alex
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <section className="bg-slate-50 py-24">
                <div className="max-w-5xl mx-auto px-6 sm:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-3xl sm:text-5xl font-black mb-4">Built for the real world</h2>
                        <p className="text-slate-400 text-lg">Not for splitting bills at restaurants. For actual ongoing financial relationships.</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", title: "Running balance", desc: "See your live net balance with each person. No need to scroll through history." },
                            { icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", title: "Shared ledgers", desc: "Each connection is a synced ledger. Both parties can log transactions." },
                            { icon: Shield, color: "text-slate-700", bg: "bg-slate-100", title: "No awkward math", desc: "Payments reduce the balance automatically. Clean, simple, accurate." },
                        ].map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                            >
                                <div className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                                    <f.icon className={`w-5 h-5 ${f.color}`} />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-3xl mx-auto px-6 sm:px-16 py-24">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black mb-4">How it works</h2>
                </motion.div>
                <div className="space-y-10">
                    {[
                        { n: "1", t: "Add a person", d: "Connect via email or account ID. Your ledger with them is instantly shared." },
                        { n: "2", t: "Log transactions", d: "Record money you're owed or money you've received. Each entry updates the running balance." },
                        { n: "3", t: "Watch it settle", d: "As payments come in, the balance shrinks. No manual 'mark as paid' required." },
                    ].map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            className="flex items-start gap-6"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-center shrink-0">{s.n}</div>
                            <div>
                                <h3 className="font-bold text-xl mb-1 text-slate-900">{s.t}</h3>
                                <p className="text-slate-400 leading-relaxed">{s.d}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-900 py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2)_0%,transparent_70%)]" />
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 px-6">
                    <h2 className="text-4xl sm:text-6xl font-black text-white mb-4">Ready to get started?</h2>
                    <p className="text-slate-400 mb-10 text-lg">Sync your first ledger in under a minute.</p>
                    <Link href="/auth">
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(99,102,241,0.5)" }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-10 py-4 rounded-2xl text-lg shadow-xl"
                        >
                            Start for free <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}