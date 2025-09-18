import { model, Schema } from "mongoose";
import { IPlan } from "./plan.interface";


const planSchema = new Schema<IPlan>(
  {
    name: { type: String, enum: ["Basic", "Plus", "Pro"], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    limits: {
      type: {
        student: { type: Number, required: true },
        teacher: { type: Number },
        activeMember: { type: Number, required: true },
      },
      required: true
    },

    roles: { type: [String], required: true },

    features: {
      type: {
        admin: { type: [String] },
        teacher: { type: [String] },
        student: { type: [String] },
      },
      required: false
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Plan = model<IPlan>("Plan", planSchema);
