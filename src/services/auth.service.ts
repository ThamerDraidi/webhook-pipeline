import bcrypt from "bcryptjs";
import { createAuthUser, getAuthUserByEmail } from "../db/queries/auth";
import { generateToken } from "../utils/jwt";
import { BadRequestError, UnauthorizedError } from "../error";

export async function registerService(email: string, password: string) {
  const existingUser = await getAuthUserByEmail(email);
  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createAuthUser(email, hashedPassword);

  return {
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
  };
}

export async function loginService(email: string, password: string) {
  const user = await getAuthUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return {
    token: generateToken(user.id),
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
  };
}