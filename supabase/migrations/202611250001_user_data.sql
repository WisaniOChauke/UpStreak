create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.update_user_data_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

drop trigger if exists user_data_updated_at on public.user_data;
create trigger user_data_updated_at
  before update on public.user_data
  for each row execute function public.update_user_data_timestamp();

alter table public.user_data enable row level security;

create policy "Users can read their own data"
  on public.user_data for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own data"
  on public.user_data for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own data"
  on public.user_data for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.user_data to authenticated;
