import { db } from "../DBConnection";
import { authUsers } from "../schema";
import { eq } from "drizzle-orm";

export async function createAuthUser(email: string, hashedPassword: string) {
  const [user] = await db
    .insert(authUsers)
    .values({ email, password: hashedPassword })
    .returning();
  return user;
}

export async function getAuthUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(authUsers)
    .where(eq(authUsers.email, email));
  return user ?? null;
}

export async function getAuthUserById(id: string) {
  const [user] = await db
    .select()
    .from(authUsers)
    .where(eq(authUsers.id, id));
  return user ?? null;
}