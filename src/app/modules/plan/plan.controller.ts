import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { planServices } from "./plan.service";


const createPlan = catchAsync(async (req: Request, res: Response) => {
    const result = await planServices.createPlan(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Plan Created successfully",
        data: result,
    });
})

export const planControllers = {
    createPlan,
};