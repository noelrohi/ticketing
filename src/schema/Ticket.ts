import { Category } from "@prisma/client";
import { z } from "zod";

export const TicketSchema = z.object({
  /*

    subject     String
    description String @db.LongText
    category    Category
    status      Status
    assignedTo  String?
    requestorId String
    requestor   User      @relation(fields: [requestorId], references: [id])
*/
  subject: z.string(),
  description: z.string(),
  category: z.nativeEnum(Category),
  // status: z.nativeEnum(Status),
});

export const addDateTargetSchema = z.object({ id: z.string(), date: z.date() });
