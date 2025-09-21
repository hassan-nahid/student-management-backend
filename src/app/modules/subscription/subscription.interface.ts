import { Types } from "mongoose";

export enum SUBSCRIPTION_Payment_STATUS {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    COMPLETE = "COMPLETE",
}

export enum SUBSCRIPTION_STATUS {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    UNPAID = "UNPAID",
}

export interface ISubscription {
    _id: Types.ObjectId;
    planId: Types.ObjectId;
    userId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalMonth: number;
    totalCost: number;
    paymentStatus: SUBSCRIPTION_Payment_STATUS;
    status: SUBSCRIPTION_STATUS,
    createdAt?: Date;
    updatedAt?: Date;
}