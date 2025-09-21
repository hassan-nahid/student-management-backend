import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { Plan } from "../plan/plan.model";
import { User } from "../user/user.model";
import { ISubscription, SUBSCRIPTION_Payment_STATUS } from "./subscription.interface";
import { Subscription } from "./subscription.model";
import httpStatus from "http-status-codes"



const createSubscription = async (payload: Partial<ISubscription>, userId: string) => {
    const transactionId = getTransactionId()
    const session = await Subscription.startSession();
    session.startTransaction()

    try {
        const user = await User.findById(userId)
        if (!user?.phone || !user.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book Tour.")
        }
        const plan = await Plan.findById(payload.planId).select("price _id")
        if (!plan?.price) {
            throw new AppError(httpStatus.BAD_REQUEST, "No Plan Cost Found!")
        }
        const months = Number(payload.totalMonth);
        if (!months || isNaN(months) || months <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid totalMonth");
        }

        const amount = Number(plan.price) * months;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);

        const subscription = await Subscription.create([{
            userId: userId,
            planId: plan._id,
            paymentStatus: SUBSCRIPTION_Payment_STATUS.PENDING,
            startDate: startDate,
            endDate: endDate,
            totalCost: amount,
        }], { session })
        // const payment = await Payment.create([{
        //     booking: booking[0]._id,
        //     status: PAYMENT_STATUS.UNPAID,
        //     transactionId: transactionId,
        //     amount: amount
        // }], { session })
        return subscription

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export const subscriptionServices = {
    createSubscription
}