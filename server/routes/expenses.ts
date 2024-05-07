import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";

import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";

const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(100),
  amount: z.string(),
});

type Expense = z.infer<typeof expenseSchema>;
const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json({ expenses });
  })
  .post(
    "/",
    getUser,
    zValidator("json", createPostSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: "Invalid" }, 400);
      }
    }),
    async (c) => {
      const expense = await c.req.valid("json");
      const user = c.var.user;

      const result = await db
        .insert(expensesTable)
        .values({
          ...expense,
          userId: user.id,
        })
        .returning();

      // fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
      return c.json(result, 201);
    }
  )
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user; 
    const id = Number.parseInt(c.req.param("id"));
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .then((res) => res[0]);
    // const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json(expense);
  })
  .get("/total-spend", getUser, async (c) => {
    // const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0);
    const user = c.var.user;
    const total = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);
    return c.json({ total }, 200);
  });
