/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { IGenericErrorResponse } from "../interfaces/error.Types"

export const handleCastError = (err: mongoose.Error.CastError): IGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid Mongodb ObjectID. Please provide a valid Id"
    }
}