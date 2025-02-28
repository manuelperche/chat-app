import { z } from "zod";
import { asc, eq, sql } from "drizzle-orm";
import { t } from "../trpc";
import { ProductTable } from "../utils/schema";

export const productsRouter = t.router({
  getProduct: t.procedure
    .input(z.string().uuid())
    .query(async ({ input, ctx: { db } }) => {
      const post = await db.query.ProductTable.findFirst({
        columns: {
          id: true,
          name: true,
          modelFileName: true,
          likes: true,
          dislikes: true,
        },
        with: {
          comments: true,
        },
        where: (product) => eq(product.id, input),
      });
      return post;
    }),
  getProducts: t.procedure.query(async ({ ctx: { db } }) => {
    const posts = await db.query.ProductTable.findMany({
      orderBy: [asc(ProductTable.id)],
      columns: {
        id: true,
        name: true,
        modelFileName: true,
        likes: true,
        dislikes: true,
      },
      with: {
        comments: true,
      },
    });
    return posts;
  }),
  like: t.procedure
    .input(z.string().uuid())
    .mutation(async ({ input, ctx: { db } }) => {
      const likes = await db
        .update(ProductTable)
        .set({
          likes: sql`${ProductTable.likes} + 1`,
        })
        .where(eq(ProductTable.id, input))
        .returning({ likes: ProductTable.likes });
      return likes;
    }),
  dislike: t.procedure
    .input(z.string().uuid())
    .mutation(async ({ input, ctx: { db } }) => {
      const dislikes = await db
        .update(ProductTable)
        .set({
          dislikes: sql`${ProductTable.dislikes} + 1`,
        })
        .where(eq(ProductTable.id, input))
        .returning({ dislikes: ProductTable.dislikes });
      return dislikes;
    }),
});
