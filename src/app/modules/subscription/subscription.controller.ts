import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";
import { subscriptionServices } from "./subscription.service";



const createSubscription = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as JwtPayload
    const result = await subscriptionServices.createSubscription(req.body, decodeToken.userId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Subscription Created successfully",
        data: result,
    });
})


export const subscriptionControllers = {
    createSubscription
}