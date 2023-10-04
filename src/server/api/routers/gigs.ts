import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { formSchema } from "@/pages/admin";

export const gigsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.gigs.findMany();
  }),

  create: protectedProcedure.input(formSchema).mutation(({ ctx, input }) => {
    const returnThis = ctx.prisma.gigs.create({
      data: {
        ...input,
        date: new Date(input.date),
      },
    });

    void ctx.res.revalidate("/");
    return returnThis;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const returnThis = ctx.prisma.gigs.delete({ where: { id: input.id } });

      void ctx.res.revalidate("/");
      return returnThis;
    }),
});
