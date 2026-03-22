import { db } from "../DBConnection";
import { users, userEvents } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function upsertUserAndAddScore(userId: string, points: number) {
  await db
    .insert(users)
    .values({ id: userId, totalScore: points })
    .onConflictDoUpdate({
      target: users.id,
      set: { totalScore: sql`${users.totalScore} + ${points}` },
    });
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

export async function updateUserLevel(userId: string, newLevel: number) {
  await db
    .update(users)
    .set({ level: newLevel })
    .where(eq(users.id, userId));
}