import { db } from "../DBConnection";
import { achievements, userAchievements, userEvents } from "../schema";
import { eq, notInArray, and, count } from "drizzle-orm";

export async function getUnearnedAchievements(userId: string) {
  const earned = await db
    .select({ achievementId: userAchievements.achievementId })
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const earnedIds = earned.map((e) => e.achievementId!);

  if (earnedIds.length === 0) {
    return await db.select().from(achievements);
  }

  return await db
    .select()
    .from(achievements)
    .where(notInArray(achievements.id, earnedIds));
}

export async function awardAchievement(userId: string, achievementId: string) {
  await db
    .insert(userAchievements)
    .values({ userId, achievementId })
    .onConflictDoNothing();
}

export async function getUserAchievements(userId: string) {
  return await db
    .select({
      name: achievements.name,
      earnedAt: userAchievements.earnedAt,
    })
    .from(userAchievements)
    .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
    .where(eq(userAchievements.userId, userId));
}

export async function getEventCount(userId: string, eventType: string) {
  const result = await db
    .select({ count: count() })
    .from(userEvents)
    .where(
      and(
        eq(userEvents.userId, userId),
        eq(userEvents.eventType, eventType)
      )
    );
  return result[0]?.count ?? 0;
}