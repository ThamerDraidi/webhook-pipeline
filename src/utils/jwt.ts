import jwt from "jsonwebtoken";
import { config } from "../config";

export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    config.jwt.secret as jwt.Secret,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, config.jwt.secret as jwt.Secret) as { userId: string };
}