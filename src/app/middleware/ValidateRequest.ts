import { NextFunction, Request, Response } from "express";


export const validateRequest = (zodSchema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.body.data){
            req.body = req.body.data
        }
        req.body = await zodSchema.parseAsync(req.body)
        next()
    } catch (error) {
        next(error)
    }
}