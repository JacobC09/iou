import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core"

export const userTable = pg.pgTable("users", {
    id:             pg.uuid("id").primaryKey().defaultRandom(),
    email:          pg.text("email").unique(),
    name:           pg.text("name"),
    hash:           pg.text("password_hash").notNull(),
    createdAt:      pg.timestamp("created_at").defaultNow(),
})

export const sessionTable = pg.pgTable("sessions", {
    id:             pg.uuid("id").primaryKey().defaultRandom(),
    userId:         pg.uuid("user_id").notNull().references(() => userTable.id),
    tokenHash:      pg.text("token_hash").notNull(),
    expiresAt:      pg.timestamp("expires_at").notNull()
})

export const profileTable = pg.pgTable("profiles", {
    id:             pg.serial("id").primaryKey(),
    linkedUserId:   pg.uuid("linked_user_id").references(() => userTable.id),
    name:           pg.text("name").notNull(),
})

export const contactTable = pg.pgTable("contacts", {
    id:             pg.serial("id").primaryKey(),
    owner:          pg.integer("owner").notNull().references(() => profileTable.id),
    link:           pg.integer("link").notNull().references(() => profileTable.id),
    name:           pg.text("name").notNull(),
    color:          pg.text("color"),
    dateAccessed:   pg.timestamp("date_accessed").notNull().default(sql`now()`),
    lastUpdated:    pg.timestamp("last_updated").notNull().default(sql`now()`),
    real:           pg.boolean(),
})

export const transactionTable = pg.pgTable("transactions", {
    id:             pg.serial("id").primaryKey(),
    fromProfile:    pg.integer("from_profile_id").notNull().references(() => profileTable.id),
    toProfile:      pg.integer("to_profile_id").notNull().references(() => profileTable.id),
    type:           pg.text("type").notNull(), // owes | paid
    amount:         pg.integer("amount").notNull(), // cents
    description:    pg.text("description"),
    created_at:     pg.timestamp("created_at").notNull().default(sql`now()`),
});

export type User = typeof userTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
export type Profile = typeof profileTable.$inferSelect;
export type Contact = typeof contactTable.$inferSelect;
export type Transaction = typeof transactionTable.$inferSelect;
