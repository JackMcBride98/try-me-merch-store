import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { newProductFormSchema } from "@/components/products";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany({
      include: { stockKeepingUnits: true, images: true },
    });
  }),

  create: protectedProcedure
    .input(newProductFormSchema)
    .mutation(async ({ ctx, input }) => {
      const newProduct = await ctx.prisma.product.create({
        data: {
          name: input.name,
          description: input.description,
          date: new Date(),
          stockKeepingUnits: {
            createMany: {
              data: input.sizes.map((size) => ({
                price: size.price,
                amount: size.amount,
                size: size.size,
              })),
            },
          },
          images: {
            createMany: {
              data: input.images.map((image) => ({
                url: image.url,
                order: image.order,
              })),
            },
          },
        },
      });

      await ctx.res.revalidate("/store");
      return newProduct;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.prisma.product.delete({
        where: { id: input.id },
      });

      await ctx.res.revalidate("/store");
      return deletedProduct;
    }),
});
