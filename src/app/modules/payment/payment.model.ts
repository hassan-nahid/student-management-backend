import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "Subscription",
        required: true,
        unique: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID
    },
    amount: {
        type: Number,
        required: true
    },
    paymentGatewayData: {
        type: Schema.Types.Mixed,
    },
    invoiceUrl: {
        type: String
    }
})

export const Payment = model<IPayment>("Payment", paymentSchema)