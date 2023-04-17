import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TicketSchema } from "~/schema/Ticket";

export const ticketRouter = createTRPCRouter({
  tickets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ticket.findMany({
      orderBy: {
        createdAt: "desc",
      }
    });
  }),

  create: protectedProcedure
    .input(TicketSchema)
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 m"),
        analytics: true,
      });
      const { success } = await ratelimit.limit(ctx.session.user.id);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message:
            "Too many requests, try again in 1 min. You can only post 3  per minute.",
        });
        console.log(input)
      return ctx.prisma.ticket.create({
        data: {
          subject: input.subject,
          description: input.description,
          category: input.category,
          status: "TBA",
          requestor: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  assign: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(1, "1 m"),
        analytics: true,
      });
      const { success } = await ratelimit.limit(ctx.session.user.id);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You can reassign after a minute.",
        });
      return ctx.prisma.ticket.update({
        where: {
          id: input.id,
        },
        data: {
          assignedTo: input.userId,
          status: "OPEN",
        },
      });
    }),

  close: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.ticket.update({
        where: {
          id: input.id,
        },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.ticket.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
