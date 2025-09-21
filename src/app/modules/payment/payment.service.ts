/* eslint-disable @typescript-eslint/no-explicit-any */
// import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { IPlan } from "../plan/plan.interface";

import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { SUBSCRIPTION_Payment_STATUS, SUBSCRIPTION_STATUS } from "../subscription/subscription.interface";
import { Subscription } from "../subscription/subscription.model";
import { IUser } from "../user/user.interface";

import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes"

const initPayment = async (subscriptionId: string) => {

    const payment = await Payment.findOne({ subscriptionId: subscriptionId })
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not subscription this plan")
    }
    const subscription = await Subscription.findById(payment.subscriptionId)
    const userAddress = (subscription?.userId as any).address
    const userEmail = (subscription?.userId as any).email
    const userPhoneNumber = (subscription?.userId as any).phone
    const userName = (subscription?.userId as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)
    return {
        paymentUrl: sslPayment.GatewayPageURL
    }
}
const successPayment = async (query: Record<string, string>) => {

    const session = await Subscription.startSession();
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID,
        }, { runValidators: true, session: session })

        const updatedSubscription = await Subscription.findByIdAndUpdate(updatedPayment?.subscriptionId,
            { paymentStatus: SUBSCRIPTION_Payment_STATUS.COMPLETE, status: SUBSCRIPTION_STATUS.ACTIVE},
            { new: true, runValidators: true, session })
            .populate("planId","name")
            .populate("userId","name email")

        if(!updatedPayment){
            throw new AppError(401, "Payment not found")
        }

        if(!updatedSubscription){
            throw new AppError(401, "Subscription not found")
        }
        const invoiceData : IInvoiceData = {
            subscriptionDate: updatedSubscription.createdAt as Date,
            endDate: updatedSubscription.endDate,
            totalAmount: updatedPayment.amount,
            planName : (updatedSubscription.planId as unknown as IPlan).name,
            transactionId: updatedPayment?.transactionId,
            userName: (updatedSubscription.userId as unknown as IUser).name
        }

        const pdfBuffer = await generatePdf(invoiceData)
        const cloudinaryResult  = await uploadBufferToCloudinary(pdfBuffer,"invoice")
        if(!cloudinaryResult){
            throw new AppError(401, "Error uploading pdf")
        }

        await Payment.findByIdAndUpdate(updatedPayment._id, {invoiceUrl: cloudinaryResult.secure_url},{runValidators: true, session})

        await sendEmail({
            to: (updatedSubscription.userId as unknown as IUser).email,
            subject: "Your Subscription Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        })


        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const failPayment = async (query: Record<string, string>) => {
    const session = await Subscription.startSession();
    session.startTransaction()

    try {

        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED,
        }, { runValidators: true, session: session })

        await Subscription.findByIdAndUpdate(updatedPayment?.subscriptionId,
            { paymentStatus: SUBSCRIPTION_Payment_STATUS.FAILED, status: SUBSCRIPTION_STATUS.UNPAID},
            { runValidators: true, session })



        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Falied" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}
const cancelPayment = async (query: Record<string, string>) => {
    const session = await Subscription.startSession();
    session.startTransaction()

    try {


        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELED,
        }, { runValidators: true, session: session })

        await Subscription.findByIdAndUpdate(updatedPayment?.subscriptionId,
            { paymentStatus: SUBSCRIPTION_Payment_STATUS.CANCELLED, status: SUBSCRIPTION_STATUS.UNPAID},
            { runValidators: true, session })



        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Canceled" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}


const getInvoiceDownloadUrl = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl")

    if (!payment) {
        throw new AppError(401, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    }

    return payment.invoiceUrl
};

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl

}