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
  subject: z.string().min(5, 'Subject must have a minimum characters of 5.'),
  description: z.string().min(5, 'Description must have a minimum characters of 5.'),
  category: z.nativeEnum(Category),
  // status: z.nativeEnum(Status),
});

export const addDateTargetSchema = z.object({ id: z.string(), date: z.date() });
