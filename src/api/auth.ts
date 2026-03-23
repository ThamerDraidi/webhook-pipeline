import { Request, Response, NextFunction } from "express";
import { registerService, loginService } from "../services/auth.service";
import { BadRequestError } from "../error";
import { LoginBody, RegisterBody } from "../types/auth.types";

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body as RegisterBody;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const result = await registerService(email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const result = await loginService(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}