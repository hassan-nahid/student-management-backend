import { IPlan } from "./plan.interface";
import { Plan } from "./plan.model";


const createPlan = async (payload: Partial<IPlan>) => {
    const plan = await Plan.create({
        ...payload
    });
    return plan;
}


export const planServices = {
    createPlan
}