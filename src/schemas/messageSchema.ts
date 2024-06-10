import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(5, "Message must be more than 5 characters long!")
    .max(300, "Message must be less than 300 characters long!"),
});
