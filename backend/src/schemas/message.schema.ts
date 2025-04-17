import { object, string, TypeOf } from "zod";

export const sendMessageSchema = object({
  body: object({
    content: string(),
    image: string().optional().nullable(),
  }),
  params: object({
    id: string(),
  }),
});

export type SendMessageInput = TypeOf<typeof sendMessageSchema>;