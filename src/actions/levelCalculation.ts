import { getUserById, updateUserLevel } from "../db/queries/users";
import { BadRequestError, NotFoundError } from "../error";

function computeLevel(totalScore: number): number {
  return Math.min(Math.floor(totalScore / 100), 100);
}

export async function levelCalculation(
  payload: Record<string, unknown>
) {
  const userId = payload.user_id as string;

  if (!userId) {
    throw new BadRequestError("Missing user_id in payload");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError(`User ${userId} not found`);
  }

  const newLevel = computeLevel(user.totalScore ?? 0);
  const leveledUp = newLevel > (user.level ?? 0);

  if (leveledUp) {
    await updateUserLevel(userId, newLevel);
  }

  return {
    user_id: userId,
    previous_level: user.level,
    new_level: newLevel,
    leveled_up: leveledUp,
    total_score: user.totalScore,
  };
}