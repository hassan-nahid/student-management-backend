import z from "zod";

export const planValidationSchema = z.object({
  name: z.enum(["Basic", "Plus", "Pro"]),
  price: z.number(),
  status: z.enum(["active", "inactive"]).optional(), // default handled in model
  limits: z.object({
    student: z.number(),
    teacher: z.number().optional(),
    activeMember: z.number(),
  }),
  roles: z.array(z.string()),
  features: z.object({
    admin: z.array(z.string()).optional(),
    teacher: z.array(z.string()).optional(),
    student: z.array(z.string()).optional(),
  }).optional(),
});