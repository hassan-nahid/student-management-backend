import z from "zod";
// import { SUBSCRIPTION_Payment_STATUS, SUBSCRIPTION_STATUS } from "./subscription.interface";

export const subscriptionValidationSchema = z.object({
	planId: z.string().min(1, "planId is required"),
	totalMonth: z.number().min(1,"Select Minimum 1 Month")	
});

