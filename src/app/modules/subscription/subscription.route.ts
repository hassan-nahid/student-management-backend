import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { Role } from "../user/user.interface";
import { subscriptionValidationSchema } from "./subscription.validation";
import { subscriptionControllers } from "./subscription.controller";

const router = Router()



router.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(subscriptionValidationSchema),
    subscriptionControllers.createSubscription)
// router.get("/",  subscriptionControllers.getAllPlans)
// router.get("/:id",  subscriptionControllers.getPlanById)
// router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), subscriptionControllers.updatePlan)

export const SubscriptionRoute = router