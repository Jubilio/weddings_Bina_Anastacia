import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const guests = sqliteTable("guests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  companion: text("companion"),
  allowedGuests: integer("allowed_guests").notNull().default(1),
});

export const invitations = sqliteTable(
  "invitations",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    primaryName: text("primary_name").notNull(),
    phone: text("phone"),
    responseNote: text("response_note"),
    respondedAt: integer("responded_at", { mode: "timestamp" }),
    checkedInAt: integer("checked_in_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("invitations_code_unique").on(table.code)],
);

export const invitees = sqliteTable("invitees", {
  id: text("id").primaryKey(),
  invitationId: text("invitation_id")
    .notNull()
    .references(() => invitations.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["principal", "acompanhante"] }).notNull(),
  sortOrder: integer("sort_order").notNull(),
  attendance: text("attendance", { enum: ["pendente", "sim", "nao"] })
    .notNull()
    .default("pendente"),
  confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
});

export const giftReservations = sqliteTable(
  "gift_reservations",
  {
    id: text("id").primaryKey(),
    giftKey: text("gift_key").notNull(),
    invitationId: text("invitation_id").notNull().references(() => invitations.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["reservado", "comprado"] }).notNull().default("reservado"),
    reservedAt: integer("reserved_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("gift_reservations_gift_key_unique").on(table.giftKey)],
);

export const securityRateLimits = sqliteTable("security_rate_limits", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull().default(0),
  windowStartedAt: integer("window_started_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
