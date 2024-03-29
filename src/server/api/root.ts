import { exampleRouter } from "@/server/api/routers/example";
import { gigRouter } from "@/server/api/routers/gigs";
import { createTRPCRouter } from "@/server/api/trpc";
import { productRouter } from "./routers/products";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  gig: gigRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
