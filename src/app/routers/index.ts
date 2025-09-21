import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { PlanRoutes } from "../modules/plan/plan.route";
import { SubscriptionRoute } from "../modules/subscription/subscription.route";


export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/otp",
        route: OtpRoutes
    },
    {
        path: "/plan",
        route: PlanRoutes
    },
    {
        path: "/subscription",
        route: SubscriptionRoute
    },
   

]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})