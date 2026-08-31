import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const guests = sqliteTable("guests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  companion: text("companion"),
  allowedGuests: integer("allowed_guests").notNull().default(1),
});
