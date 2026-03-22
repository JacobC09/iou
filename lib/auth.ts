"use server";

import crypto from "crypto"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm";
import { db } from "./db";
import { sessionTable, userTable } from "./schema";
import { cookies } from "next/headers";
import { createProfile } from "./server";

const sessionTokenName = "iouSession"

function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function userExists(email: string) {
    let [user] = await db.select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1)

    return user !== undefined
}

export async function createSession(userId: string) {
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 100);

    await db.insert(sessionTable).values({
        userId,
        tokenHash,
        expiresAt: expires
    });

    (await cookies()).set(sessionTokenName, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires
    })
}

export async function getSession(): Promise<typeof userTable.$inferSelect | null> {
    const token = (await cookies()).get(sessionTokenName)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);

    const [ session ] = await db
        .select({ user: userTable, expiresAt: sessionTable.expiresAt })
        .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
        .where(eq(sessionTable.tokenHash, tokenHash))
        .limit(1);

    if (!session) return null
    if (session.expiresAt < new Date()) return null

    return session.user;
}

export async function signup(email: string, name: string, password: string): Promise<{
    success: true,
} | {
    success: false,
    error: string;
    affected: string[]
}> {
    try {
        if (!email || !password) return { success: false, affected: ["email", "password"], error: "Email and password are required" }
        if (password.length < 8) return { success: false, affected: ["password"], error: "Password must be at least 8 characters" }

        const existing = await db.query.userTable.findFirst({
            where: eq(userTable.email, email),
        })

        if (existing) return { success: false, affected: [], error: "An account with this email already exists." }

        const hash = await bcrypt.hash(password, 10)

        const [user] = await db
            .insert(userTable)
            .values({
                email,
                name,
                hash,
            })
            .returning()

        if (!user) return { success: false, affected: [], error: "Failed to create account." }

        await createProfile(user.id, name);
        await createSession(user.id);

        return { success: true }

    } catch (err) {
        console.error("Signup error:", err);
        return { success: false, affected: [], error: "Something went wrong. Please try again." }
    }
}

export async function login(email: string, password: string): Promise<{
    success: true,
} | {
    success: false,
    error: string;
    affected: string[]
}> {
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email)
    })

    if (!user) return { success: false, affected: ["email"], error: "No user found" }

    const valid = await bcrypt.compare(password, user.hash)

    if (!valid) return { success: false, affected: ["password"], error: "Invalid password" }

    await createSession(user.id);

    return { success: true };
}

export async function logout() {
    let biscuits = await cookies(); 

    const token = biscuits.get(sessionTokenName)?.value
    if (!token) return

    const tokenHash = hashToken(token)

    await db.delete(sessionTable)
        .where(eq(sessionTable.tokenHash, tokenHash))

    biscuits.delete(sessionTokenName);
}
