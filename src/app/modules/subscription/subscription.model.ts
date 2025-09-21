import { model, Schema } from "mongoose";
import { ISubscription, SUBSCRIPTION_Payment_STATUS, SUBSCRIPTION_STATUS } from "./subscription.interface";

const subScriptionSchema = new Schema<ISubscription>(
    {
        planId: {
            type: Schema.Types.ObjectId,
            ref: "Plan",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true
        },
        totalCost: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(SUBSCRIPTION_Payment_STATUS),
            default: SUBSCRIPTION_Payment_STATUS.PENDING
        },
        status: {
            type: String,
            enum: Object.values(SUBSCRIPTION_STATUS),
            default: SUBSCRIPTION_STATUS.UNPAID
        }

    }, {
    timestamps: true,
    versionKey: false
}
)
export const Subscription = model<ISubscription>("Subscription", subScriptionSchema)