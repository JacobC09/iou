"use server";

import { eq, or } from "drizzle-orm";
import { db } from "./db";
import { contactTable, profileTable, transactionTable, userTable } from "./schema";
import { COLORS } from "./utils";
import { getSession } from "./auth";

export interface AppData {
    user: typeof userTable.$inferSelect;
    profile: typeof profileTable.$inferSelect;
    transactions: typeof transactionTable.$inferSelect[];
    contacts: typeof contactTable.$inferSelect[];
}

export async function getAppData(): Promise<AppData | null> {
    const user = await getSession();
    if (!user) return null;

    const profile = await db.query.profileTable.findFirst({
        where: eq(profileTable.linkedUserId, user.id)
    });

    if (!profile) return null;

    const [transactions, contacts] = await Promise.all([
        db.select()
            .from(transactionTable)
            .where(
                or(
                    eq(transactionTable.fromProfile, profile.id),
                    eq(transactionTable.toProfile, profile.id)
                )
            ),
        db.select()
            .from(contactTable)
            .where(eq(contactTable.owner, profile.id))
    ]);

    return { user, profile, transactions, contacts };
}

export async function createProfile(
    userId: string | null,
    name: string,
): Promise<typeof profileTable.$inferSelect> {
    const [profile] = await db.insert(profileTable).values({
        linkedUserId: userId,
        name: name
    }).returning()

    return profile;
}

export async function createContact(
    profileId: number,
    name: string
): Promise<typeof contactTable.$inferSelect> {
    const link = await createProfile(null, name);
    const [contact] = await db.insert(contactTable).values({
        owner: profileId,
        link: link.id,
        name: name,
        color: COLORS[Math.round(Math.random() * COLORS.length)],
        real: false,
    }).returning();

    return contact;
}

export async function updateContactSettings(
    id: number,
    name: string,
    color: string
) {
    await db.update(contactTable)
        .set({ color, name })
        .where(eq(contactTable.id, id));
}

export async function addTransaction(
    fromProfile: number,
    toProfile: number,
    type: string,
    amount: number,
    description: string
) {
    await db.insert(transactionTable).values({
        fromProfile, toProfile, type, amount, description
    });
}

export async function updateRecent(id: number) {
    await db.update(contactTable)
        .set({ dateAccessed: new Date() })
        .where(eq(contactTable.id, id));
}

export async function updateLastUpdated(id: number) {
    await db.update(contactTable)
        .set({ lastUpdated: new Date() })
        .where(eq(contactTable.id, id));
}

export async function deleteContact(contact: typeof contactTable.$inferSelect) {
    const linkedProfile = await db.query.profileTable.findFirst({
        where: eq(profileTable.id, contact.link)
    });

    if (!linkedProfile) return;

    if (linkedProfile.linkedUserId == null) {
        await db.delete(transactionTable)
            .where(or(
                eq(transactionTable.fromProfile, linkedProfile.id),
                eq(transactionTable.toProfile, linkedProfile.id)
            ));

        await db.delete(contactTable).where(eq(contactTable.id, contact.id));
        await db.delete(profileTable).where(eq(profileTable.id, linkedProfile.id));
    } else {
        // linked
    }
}

export async function updateUser(id: string, name: string, email: string): Promise<boolean> {
    try {
        await db.update(userTable).set({
            name, email
        }).where(eq(userTable.id, id));
        return true;
    } catch {
        return false;
    }
}

export async function deleteTransaction(id: number) {
    await db.delete(transactionTable).where(eq(transactionTable.id, id));
}