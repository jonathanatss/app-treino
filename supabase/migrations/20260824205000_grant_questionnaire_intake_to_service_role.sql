begin;

-- The public questionnaire is accepted only by the server-side Netlify
-- function. The service role bypasses RLS, but still needs explicit table
-- privileges because this schema revokes broad public access.
grant insert, select on table public.questionnaire_submissions to service_role;

commit;
