import { upsertUserAndAddScore, getUserById, createUserEvent } from "../db/queries/users";
import { BadRequestError } from "../error";

const SCORE_MAP: Record<string, number> = {
  chapter_completed: 10,
  quiz_completed: 25,
  course_completed: 100,
  project_submitted: 75,
  streak_achieved: 50,
};

export async function scoreCalculation(
  eventType: string,
  payload: Record<string, unknown>
) {
  const userId = payload.user_id as string;

  if (!userId) {
    throw new BadRequestError("Missing user_id in payload");
  }

  const points = SCORE_MAP[eventType] ?? 5;

  await upsertUserAndAddScore(userId, points);

  await createUserEvent(
    userId,
    eventType,
    points,
    payload.reference_id as string
  );

  const user = await getUserById(userId);

  return {
    user_id: userId,
    points_awarded: points,
    total_score: user?.totalScore ?? points,
  };
}