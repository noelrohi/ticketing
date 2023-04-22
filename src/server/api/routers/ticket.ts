import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TicketSchema, addDateTargetSchema } from "~/schema/Ticket";

export const ticketRouter = createTRPCRouter({
  tickets: publicProcedure.query(async ({ ctx }) => {
    const tix = await ctx.prisma.ticket.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        requestor: {
          select: {
            role: true,
            name: true,
            email: true,
            image: true,
            id: true,
          },
        },
        assignee: {
          select: {
            role: true,
            name: true,
            email: true,
            image: true,
            id: true,
          },
        },
      },
    });

    return tix;
  }),

  ticketsBy: publicProcedure
    .input(z.object({ id: z.string(), type: z.enum(['Requests', 'Tasks']) }))
    .query(async ({ ctx, input }) => {
      let users;
      if(input.type === 'Requests'){
        users = await ctx.prisma.ticket.findMany({
          where: {
            requestorId: input.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            requestor: {
              select: {
                role: true,
                name: true,
                email: true,
                image: true,
                id: true,
              },
            },
            assignee: {
              select: {
                role: true,
                name: true,
                email: true,
                image: true,
                id: true,
              },
            },
          },
        });
      }else{
        users = await ctx.prisma.ticket.findMany({
          where: {
            assignedTo: input.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            requestor: {
              select: {
                role: true,
                name: true,
                email: true,
                image: true,
                id: true,
              },
            },
            assignee: {
              select: {
                role: true,
                name: true,
                email: true,
                image: true,
                id: true,
              },
            },
          },
        });
      }
      

      return users;
    }),

  addDateTarget: protectedProcedure
    .input(addDateTargetSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.ticket.update({
        where: {
          id: input.id,
        },
        data: {
          target: input.date,
          status: "OPEN",
        },
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
      console.log(input);

      const dateString = Date.now().toString(36);
      const randomness = Math.random().toString(36).substring(2);

      return ctx.prisma.ticket.create({
        data: {
          id: `TICKET-${dateString}-${randomness}`,
          subject: input.subject,
          description: input.description,
          category: input.category,
          status: "TBA",
          requestor: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  assign: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string().cuid("User not Set.") }))
    .mutation(async ({ ctx, input }) => {
      const tick = await ctx.prisma.ticket.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!tick)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found.",
        });
      console.log(tick.target);
      if (!tick.target) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Kindly set its date target first before assigning.",
        });
      }

      // const ratelimit = new Ratelimit({
      //   redis: Redis.fromEnv(),
      //   limiter: Ratelimit.slidingWindow(1, "1 m"),
      //   analytics: true,
      // });
      // const { success } = await ratelimit.limit(ctx.session.user.id);
      // if (!success)
      //   throw new TRPCError({
      //     code: "TOO_MANY_REQUESTS",
      //     message: "You can assign more after a minute.",
      //   });

      return ctx.prisma.ticket.update({
        where: {
          id: input.id,
        },
        data: {
          assignedTo: input.userId,
          status: "IN_PROGRESS",
        },
        include: {
          assignee: true,
        }
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
