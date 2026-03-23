import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { getAuthUserById } from "../db/queries/auth";
import { UnauthorizedError } from "../error";
import { AuthRequest } from "../types/auth.types";

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await getAuthUserById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.userId = user.id;
    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}