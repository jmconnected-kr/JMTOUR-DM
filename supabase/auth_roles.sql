create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'participant')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.user_roles enable row level security;

drop trigger if exists on_auth_user_created_assign_role on auth.users;
drop function if exists public.handle_new_auth_user_role();

create function public.handle_new_auth_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'participant')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_assign_role
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user_role();

-- 관리자 계정 승격 예시
-- update public.user_roles
-- set role = 'admin'
-- where user_id = 'YOUR_ADMIN_AUTH_USER_UUID';
