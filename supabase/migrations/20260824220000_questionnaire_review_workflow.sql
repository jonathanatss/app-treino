begin;

alter table public.questionnaire_submissions
  add column if not exists review_note text,
  add column if not exists invitation_sent_at timestamptz;

comment on column public.questionnaire_submissions.review_note is
  'Optional internal note recorded when an administrator reviews the request.';

comment on column public.questionnaire_submissions.invitation_sent_at is
  'Timestamp of the first automatic account invitation sent after approval.';

commit;
