import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}
export interface LoginBody {
  email: string;
  password: string;
}
export interface RegisterBody {
  email: string;
  password: string;
}

