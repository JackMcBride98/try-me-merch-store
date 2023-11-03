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
      include: { stockKeepingUnits: true },
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
          // images: {
          //   create: {
          //     url: "test",
          //     alt: "test",
          //     order: 1,
          //   },
          // },
        },
      });

      //add back when /store is making call to getStaticProps
      // await ctx.res.revalidate("/store");
      return newProduct;
    }),

  // delete: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const deletedGig = await ctx.prisma.gigs.delete({
  //       where: { id: input.id },
  //     });

  //     await ctx.res.revalidate("/");
  //     return deletedGig;
  //   }),
});
