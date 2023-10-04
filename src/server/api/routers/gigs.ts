import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { newGigFormSchema } from "@/components/newGigForm";

export const gigsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.gigs.findMany();
  }),

  create: protectedProcedure
    .input(newGigFormSchema)
    .mutation(async ({ ctx, input }) => {
      const newGig = await ctx.prisma.gigs.create({
        data: {
          ...input,
          date: new Date(input.date),
        },
      });

      await ctx.res.revalidate("/");
      return newGig;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedGig = await ctx.prisma.gigs.delete({
        where: { id: input.id },
      });

      await ctx.res.revalidate("/");
      return deletedGig;
    }),
});
