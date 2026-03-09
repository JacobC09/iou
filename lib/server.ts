"use server";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { contactTable, profileTable, transactionTable } from "./schema";
import { colorFromStr } from "./utils";

export async function createProfile(
    name: string, 
    userId: string | null
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
    const link = await createProfile(name, null);
    
    const [contact] = await db.insert(contactTable).values({
        owner: profileId,
        link: link.id,
        name: name,
        color: colorFromStr(name)
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
    console.log(fromProfile, toProfile, type, amount, description)
    await db.insert(transactionTable).values({
        fromProfile, toProfile, type, amount, description
    })
}