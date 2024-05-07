import {
  text,
  pgTable,
  serial,
  index,
  date,
  numeric,
  timestamp
} from "drizzle-orm/pg-core";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    // date: date("date").notNull(),
    createdAt: timestamp('created_at').defaultNow()
  },
  (expenses) => {
    return {
      userIdIndex: index("name_idx").on(expenses.userId),
    };
  }
);
