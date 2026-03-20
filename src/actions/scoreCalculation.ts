import { upsertUser, addUserScore, getUserById, createUserEvent } from "../db/queries/users";

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
    throw new Error("Missing user_id in payload");
  }

  const points = SCORE_MAP[eventType] ?? 5;
  await upsertUser(userId);
  await addUserScore(userId, points);
  await createUserEvent(
    userId,
    eventType,
    points,
   payload.chapter_id as string
  );

  const user = await getUserById(userId);

  return {
    user_id: userId,
    points_awarded: points,
    total_score: user?.totalScore ?? points,
  };
}