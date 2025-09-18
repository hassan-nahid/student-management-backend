import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateRequest } from "../../middleware/ValidateRequest";
import { planValidationSchema } from "./plan.validation";
import { Role } from "../user/user.interface";
import { planControllers } from "./plan.controller";

const router = Router()



router.post("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(planValidationSchema),
    planControllers.createPlan)
// router.get("/",  planControllers.getAllPlans)
// router.get("/:id",  planControllers.getPlanById)
// router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), planControllers.updatePlan)

export const PlanRoutes = router