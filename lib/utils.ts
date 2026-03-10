import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { transactionTable } from "./schema"

export const COLORS = ["#1e293b","#6366f1","#ec4899","#f97316","#10b981","#3b82f6","#8b5cf6","#ef4444","#eab308","#14b8a6"];

export type TransactionType = "they_owe" | "i_owe" | "they_paid" | "i_paid"

export function getRelatedTransactions(a: number, b: number, transactions: typeof transactionTable.$inferSelect[]) {
    return transactions.filter(
        (t) => (t.fromProfile == a && t.toProfile == b) || (t.toProfile == a && t.fromProfile == b)
    )
}

export function getTransactionType(relativeTo: number, t: typeof transactionTable.$inferSelect): TransactionType {
    if (t.type == "paid") {
        return t.fromProfile == relativeTo ? "i_paid" : "they_paid";
    } else {
        return t.fromProfile == relativeTo ? "i_owe" : "they_owe";
    }
}

export function colorFromStr(s: string) {
    return COLORS[[...s].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,0) % COLORS.length]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
    return name.split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function capitalize(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

export function getBalance(id: number, transactions: typeof transactionTable.$inferInsert[]): {
    net: number,
    totalOwed: number,
    totalIOwe: number,
} {
    let totalOwed = 0;
    let totalIOwe = 0;

    for (const t of transactions) {
        const dollars = t.amount / 100;

        if (t.type == "owes") {
            if (t.fromProfile == id) {
                totalIOwe += dollars;
            } else {
                totalOwed += dollars;
            }
        } else if (t.type == "paid") {
            if (t.fromProfile == id) {
                totalOwed -= dollars;
            } else {
                totalIOwe -= dollars;
            }
        }
    }

    return { net: totalIOwe - totalOwed , totalOwed, totalIOwe };
}