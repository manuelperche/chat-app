import { z } from "zod";
import { eq } from "drizzle-orm";
import { t } from "../trpc";
import { CommentsTable } from "../utils/schema";

export const commentsRouter = t.router({
  addComment: t.procedure
    .input(
      z.object({
        productId: z.string().uuid(),
        name: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const comments = await db
        .insert(CommentsTable)
        .values({
          productId: input.productId,
          name: input.name,
          text: input.text,
        })
        .returning();

      return comments;
    }),
  editComment: t.procedure
    .input(z.object({ id: z.string().uuid(), text: z.string() }))
    .mutation(async ({ input, ctx: { db } }) => {
      const comments = await db
        .update(CommentsTable)
        .set({
          text: input.text,
          updatedAt: new Date(),
        })
        .where(eq(CommentsTable.id, input.id))
        .returning();
      return comments;
    }),
  deleteComment: t.procedure
    .input(z.string().uuid())
    .mutation(async ({ input, ctx: { db } }) => {
      const comments = await db
        .delete(CommentsTable)
        .where(eq(CommentsTable.id, input))
        .returning();
      return comments;
    }),
});
