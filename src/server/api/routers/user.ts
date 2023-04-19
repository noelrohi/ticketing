import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    
    return users;
  }),

  requestsOf: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
        include: {
            requests : {
                orderBy: {
                    createdAt: "desc"
                },
            }
        },
    });
    
    return users;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
