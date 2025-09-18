import { IPlan } from "./plan.interface";
import { Plan } from "./plan.model";


const createPlan = async (payload: Partial<IPlan>) => {
    const plan = await Plan.create({
        ...payload
    });
    return plan;
}


const getAllPlans = async () => {
    const plans = await Plan.find();
    return plans;
};

const getPlanById = async (id: string) => {
    const plan = await Plan.findById(id);
    return plan;
};

const updatePlan = async (id: string, payload: Partial<IPlan>) => {
    const plan = await Plan.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return plan;
};

export const planServices = {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan
}