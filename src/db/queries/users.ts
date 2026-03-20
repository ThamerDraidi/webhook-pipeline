import { db } from "../DBConnection";
import { users, userEvents } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function upsertUser(userId: string) {
  await db
    .insert(users)
    .values({ id: userId })
    .onConflictDoNothing();
}

export async function addUserScore(userId: string, points: number) {
  await db
    .update(users)
    .set({ totalScore: sql`${users.totalScore} + ${points}` })
    .where(eq(users.id, userId));
}

export async function getUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return user ?? null;
}

export async function createUserEvent(
  userId: string,
  eventType: string,
  scoreAwarded: number,
  referenceId?: string
) {
  await db.insert(userEvents).values({
    userId,
    eventType,
    referenceId: referenceId ?? null,
    scoreAwarded,
  });
}