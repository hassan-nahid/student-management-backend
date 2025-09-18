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


const getAllPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await planServices.getAllPlans();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Plans fetched successfully",
        data: result,
    });
});

const getPlanById = catchAsync(async (req: Request, res: Response) => {
    const result = await planServices.getPlanById(req.params.id);
    if (!result) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Plan not found",
            data: null
        });
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Plan fetched successfully",
        data: result,
    });
});

const updatePlan = catchAsync(async (req: Request, res: Response) => {
    const result = await planServices.updatePlan(req.params.id, req.body);
    if (!result) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Plan not found",
            data: null
        });
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Plan updated successfully",
        data: result,
    });
});

export const planControllers = {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
};