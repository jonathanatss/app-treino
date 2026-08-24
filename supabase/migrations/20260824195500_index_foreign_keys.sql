begin;

create index if not exists conversations_created_by_idx on public.conversations (created_by) where created_by is not null;
create index if not exists exercise_catalog_created_by_idx on public.exercise_catalog (created_by) where created_by is not null;
create index if not exists messages_sender_idx on public.messages (sender_id) where sender_id is not null;
create index if not exists notifications_actor_idx on public.notifications (actor_id) where actor_id is not null;
create index if not exists alternatives_exercise_idx on public.plan_exercise_alternatives (exercise_id);
create index if not exists plan_exercises_exercise_idx on public.plan_exercises (exercise_id);
create index if not exists questionnaire_user_idx on public.questionnaire_submissions (user_id) where user_id is not null;
create index if not exists questionnaire_reviewed_by_idx on public.questionnaire_submissions (reviewed_by) where reviewed_by is not null;
create index if not exists training_plans_coach_idx on public.training_plans (coach_id) where coach_id is not null;
create index if not exists workout_checkins_user_idx on public.workout_checkins (user_id);
create index if not exists workout_exercise_logs_plan_exercise_idx on public.workout_exercise_logs (plan_exercise_id) where plan_exercise_id is not null;
create index if not exists workout_exercise_logs_exercise_idx on public.workout_exercise_logs (exercise_id);
create index if not exists workout_sessions_workout_day_idx on public.workout_sessions (workout_day_id) where workout_day_id is not null;

commit;
