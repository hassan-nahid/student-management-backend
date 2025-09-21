import { Types } from "mongoose";

export interface IPlan {
  _id: Types.ObjectId;
  name: "Basic" | "Plus" | "Pro";
  price: number;
  status: "active" | "inactive";
  
  limits: {
    student: number;
    teacher?: number;      
    activeMember: number;
  };

  roles: string[]; 

  features: {
    admin?: string[];    
    teacher?: string[];   
    student?: string[];  
  };
}