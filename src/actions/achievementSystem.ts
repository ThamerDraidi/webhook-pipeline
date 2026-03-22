import { getUserById } from "../db/queries/users";
import { getUnearnedAchievements, awardAchievement, getUserAchievements, getEventCount } from "../db/queries/achievements";
import { BadRequestError, NotFoundError } from "../error";

export async function achievementSystem(
  payload: Record<string, unknown>
) {
  const userId = payload.user_id as string;

  if (!userId) {
    throw new BadRequestError("Missing user_id in payload");
  }

  const user = await getUserById(userId);
if (!user) throw new NotFoundError(`User ${userId} not found`);

  const unearned = await getUnearnedAchievements(userId);
  const newlyEarned: string[] = [];

  for (const achievement of unearned) {
    const cond = achievement.condition as Record<string, unknown>;
    let earned = false;

    if (cond.min_score && (user.totalScore ?? 0) >= (cond.min_score as number)) {
      earned = true;
    } else if (cond.min_level && (user.level ?? 0) >= (cond.min_level as number)) {
      earned = true;
    } else if (cond.event_type && cond.min_count) {
      const count = await getEventCount(userId, cond.event_type as string);
      if (count >= (cond.min_count as number)) {
        earned = true;
      }
    }

    if (earned) {
      await awardAchievement(userId, achievement.id);
      newlyEarned.push(achievement.name);
    }
  }

  const allAchievements = await getUserAchievements(userId);

  return {
    user_id: userId,
    newly_earned: newlyEarned,
    total_achievements: allAchievements.length,
    achievements: allAchievements,
  };
}