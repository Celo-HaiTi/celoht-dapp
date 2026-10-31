-- Quiz answer keys are read only by trusted server routes using the service role.
drop policy if exists "published quiz questions public" on public.quiz_questions;