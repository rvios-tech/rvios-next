-- RVIOS Store — initial schema
-- RVIOS Store creates stores and serves storefronts. Accounts and day-to-day management move to AzmSmart,
-- which will link a store to its owner (owner_id) using owner_email. Until then stores are created via create_store().

create extension if not exists "pgcrypto";

-- ---------- reference data ----------
create table public.plans (
  id text primary key check (id in ('free','pro','biz')),
  name_ar text not null, name_en text not null,
  price_month numeric(10,2) not null default 0,
  price_year  numeric(10,2) not null default 0,
  limits jsonb not null default '{}'::jsonb          -- {"products":10,"categories":3,"images":3,"team":0}
);
insert into public.plans (id,name_ar,name_en,price_month,price_year,limits) values
  ('free','مجاني','Free',0,0,'{"products":10,"categories":3,"images":3,"team":0,"coupons":false,"branding":true}'),
  ('pro','احترافي','Pro',6,60,'{"products":500,"categories":null,"images":8,"team":0,"coupons":true,"branding":false}'),
  ('biz','أعمال','Business',15,150,'{"products":null,"categories":null,"images":12,"team":3,"coupons":true,"branding":false}');

create table public.templates (
  id text primary key,                                -- noir, maison, dahab, ...
  tier text not null check (tier in ('free','standard','signature')),
  price numeric(10,2) not null default 0,
  sector text not null,
  name_ar text not null, name_en text not null,
  active boolean not null default true
);

insert into public.templates(id,tier,price,sector,name_ar,name_en) values
 ('essential','free',0,'any','أساسي','Essential'),('sukkar','standard',19,'food','سُكّر','Sukkar'),('waraq','standard',15,'books','ورق','Waraq'),
 ('marah','standard',17,'kids','مرح','Marah'),('asal','standard',19,'honey','عسل','Asal'),('zahr','standard',22,'plants','زهر','Zahr'),
 ('turath','standard',24,'crafts','تراث','Turath'),('maida','standard',25,'restaurant','مائدة','Maida'),('nabd','standard',27,'sports','نبض','Nabd'),
 ('bayt','standard',29,'home','بيت','Bayt'),('qita','standard',29,'auto','قِطع','Qita'),('nada','signature',32,'beauty','ندى','Nada'),
 ('satr','signature',35,'modest','سَتر','Satr'),('volt','signature',39,'electronics','فولت','Volt'),('khatwa','signature',39,'brand','خطوة','Khatwa'),
 ('maison','signature',45,'fashion','ميزون','Maison'),('noir','signature',49,'fragrance','نوار','Noir'),('dahab','signature',55,'jewelry','ذهب','Dahab');

-- ---------- merchants ----------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles on delete set null,   -- linked later by AzmSmart
  owner_email text not null,
  status text not null default 'active' check (status in ('active','pending_payment','suspended')),
  billing text check (billing in ('month','year')),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,40}$'),
  name_ar text not null, name_en text,
  logo_text text, logo_url text, cover_url text,
  color text not null default '#C1272D',
  whatsapp text, city text, announce text,
  template_id text not null default 'essential' references public.templates,
  plan_id text not null default 'free' references public.plans,
  plan_expires_at timestamptz,
  verified boolean not null default false,
  custom_domain text unique,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.stores(owner_id);
create index on public.stores(owner_email);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores on delete cascade,
  name_ar text not null, name_en text,
  position int not null default 0
);
create index on public.categories(store_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores on delete cascade,
  category_id uuid references public.categories on delete set null,
  name_ar text not null, name_en text,
  description_ar text, description_en text,
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2),
  images text[] not null default '{}',
  variant_label text, variant_options text[],
  stock int, badge text check (badge in ('best','new','sale')),
  visible boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index on public.products(store_id, visible);

-- ---------- orders (money stays between merchant and buyer; status only) ----------
create type public.order_status as enum ('pending','confirmed','preparing','delivered','cancelled');
create table public.orders (
  id bigint generated always as identity primary key,
  store_id uuid not null references public.stores on delete cascade,
  number int not null,
  status public.order_status not null default 'pending',
  customer_name text not null, customer_phone text not null,
  city text not null, address text not null, notes text,
  coupon text, subtotal numeric(12,2) not null, total numeric(12,2) not null,
  created_at timestamptz not null default now(),
  unique (store_id, number)
);
create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders on delete cascade,
  product_id uuid references public.products on delete set null,
  name text not null, option text, qty int not null check (qty > 0), unit_price numeric(12,2) not null
);

-- per-store sequential order numbers
create or replace function public.next_order_number() returns trigger language plpgsql as $$
begin
  select coalesce(max(number), 2040) + 1 into new.number from public.orders where store_id = new.store_id;
  return new;
end $$;
create trigger orders_number before insert on public.orders for each row execute function public.next_order_number();

-- ---------- billing: subscriptions & template licenses via manual transfer proofs ----------
create table public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores on delete cascade,
  kind text not null check (kind in ('plan','template','service')),
  plan_id text references public.plans, billing text check (billing in ('month','year')),
  template_id text references public.templates,
  amount numeric(10,2) not null, method text not null check (method in ('jaib','kuraimi','other')),
  receipt_path text not null,                         -- storage: receipts/<store_id>/<file>
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reject_reason text, reviewed_by uuid references public.profiles, reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.template_licenses (
  store_id uuid not null references public.stores on delete cascade,
  template_id text not null references public.templates,
  granted_at timestamptz not null default now(),
  primary key (store_id, template_id)
);

-- approving a proof activates the plan / template
create or replace function public.apply_payment(proof uuid) returns void language plpgsql security definer as $$
declare p public.payment_proofs;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then raise exception 'admin only'; end if;
  update public.payment_proofs set status='approved', reviewed_by=auth.uid(), reviewed_at=now() where id=proof returning * into p;
  if p.kind = 'plan' then
    update public.stores set plan_id = p.plan_id, status = 'active',
      plan_expires_at = greatest(coalesce(plan_expires_at, now()), now()) + (case when p.billing='year' then interval '1 year' else interval '1 month' end)
    where id = p.store_id;
  elsif p.kind = 'template' then
    insert into public.template_licenses(store_id, template_id) values (p.store_id, p.template_id) on conflict do nothing;
    update public.stores set template_id = p.template_id where id = p.store_id;
  end if;
end $$;

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_proofs enable row level security;
alter table public.template_licenses enable row level security;
alter table public.plans enable row level security;
alter table public.templates enable row level security;

create or replace function public.owns_store(s uuid) returns boolean language sql stable as
$$ select exists (select 1 from public.stores where id = s and owner_id = auth.uid()) $$;
create or replace function public.is_admin() returns boolean language sql stable as
$$ select coalesce((select is_admin from public.profiles where id = auth.uid()), false) $$;

create policy "plans readable" on public.plans for select using (true);
create policy "templates readable" on public.templates for select using (true);
create policy "own profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());

create policy "public stores" on public.stores for select using (published or owner_id = auth.uid() or public.is_admin());
-- plan_id / verified / plan_expires_at are changed only through apply_payment (security definer) or by admins
create policy "update own store" on public.stores for update using (owner_id = auth.uid() or public.is_admin());

create policy "public categories" on public.categories for select using (true);
create policy "manage categories" on public.categories for all using (public.owns_store(store_id)) with check (public.owns_store(store_id));
create policy "public products" on public.products for select using (visible or public.owns_store(store_id));
create policy "manage products" on public.products for all using (public.owns_store(store_id)) with check (public.owns_store(store_id));

create policy "owner reads orders" on public.orders for select using (public.owns_store(store_id) or public.is_admin());
create policy "owner updates orders" on public.orders for update using (public.owns_store(store_id));
create policy "owner reads items" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and public.owns_store(o.store_id)));

create policy "submit proofs" on public.payment_proofs for insert with check (public.owns_store(store_id));
create policy "read proofs" on public.payment_proofs for select using (public.owns_store(store_id) or public.is_admin());
create policy "admin reviews proofs" on public.payment_proofs for update using (public.is_admin());
create policy "read licenses" on public.template_licenses for select using (public.owns_store(store_id) or public.is_admin());

-- protect billing fields: only admins (or apply_payment, run by an admin) may change them
create or replace function public.protect_store_fields() returns trigger language plpgsql as $$
begin
  if not public.is_admin() and (new.plan_id is distinct from old.plan_id or new.plan_expires_at is distinct from old.plan_expires_at
     or new.verified is distinct from old.verified or new.owner_id is distinct from old.owner_id) then
    raise exception 'billing fields are read-only';
  end if;
  return new;
end $$;
create trigger stores_protect before update on public.stores for each row execute function public.protect_store_fields();

-- orders are placed through this function: prices are read from the database, never trusted from the client
create or replace function public.place_order(p_slug text, p_items jsonb, p_customer jsonb, p_coupon text default null)
returns table (order_id bigint, order_number int, order_total numeric) language plpgsql security definer as $$
declare s public.stores; sub numeric := 0; o public.orders; it jsonb; pr public.products;
begin
  select * into s from public.stores where slug = p_slug and published;
  if s.id is null then raise exception 'store not found'; end if;
  insert into public.orders(store_id, number, customer_name, customer_phone, city, address, notes, coupon, subtotal, total)
  values (s.id, 0, p_customer->>'name', p_customer->>'phone', p_customer->>'city', p_customer->>'address', p_customer->>'notes', p_coupon, 0, 0)
  returning * into o;
  for it in select * from jsonb_array_elements(p_items) loop
    select * into pr from public.products where id = (it->>'product_id')::uuid and store_id = s.id and visible;
    if pr.id is null then raise exception 'invalid product'; end if;
    insert into public.order_items(order_id, product_id, name, option, qty, unit_price)
    values (o.id, pr.id, pr.name_ar, it->>'option', greatest(1, (it->>'qty')::int), pr.price);
    sub := sub + pr.price * greatest(1, (it->>'qty')::int);
  end loop;
  update public.orders set subtotal = sub,
    total = case when upper(coalesce(p_coupon,'')) = 'RVIOS10' and s.plan_id <> 'free' then round(sub * 0.9) else sub end
  where id = o.id returning * into o;
  return query select o.id, o.number, o.total;
end $$;
grant execute on function public.place_order(text, jsonb, jsonb, text) to anon, authenticated;

-- store creation (public, from the /create flow). Free → active immediately on <slug>.rvios.store;
-- paid → created now, plan/template activated when an admin approves the transfer (apply_payment).
create or replace function public.create_store(p_slug text, p_name_ar text, p_name_en text, p_color text, p_whatsapp text, p_email text,
  p_template text, p_plan text, p_billing text, p_domain text, p_method text, p_amount numeric, p_receipt text)
returns setof public.stores language plpgsql security definer as $$
declare s public.stores; t public.templates;
begin
  select * into t from public.templates where id = p_template;
  if t.id is null then raise exception 'unknown template'; end if;
  if p_plan = 'free' and t.tier <> 'free' then raise exception 'free plan includes the free template only'; end if;
  insert into public.stores(slug, name_ar, name_en, color, whatsapp, owner_email, template_id, plan_id, billing, custom_domain, status)
  values (lower(p_slug), p_name_ar, p_name_en, coalesce(p_color,'#C1272D'), p_whatsapp, p_email,
          case when p_plan = 'free' then t.id else 'essential' end, 'free', p_billing,
          case when p_plan = 'free' then null else nullif(p_domain,'') end,
          case when p_plan = 'free' then 'active' else 'pending_payment' end)
  returning * into s;
  if p_plan <> 'free' then
    insert into public.payment_proofs(store_id, kind, plan_id, billing, amount, method, receipt_path)
    values (s.id, 'plan', p_plan, p_billing, p_amount, coalesce(p_method,'other'), coalesce(p_receipt,'pending'));
    if t.tier <> 'free' then
      insert into public.payment_proofs(store_id, kind, template_id, amount, method, receipt_path)
      values (s.id, 'template', t.id, 0, coalesce(p_method,'other'), coalesce(p_receipt,'pending'));
    end if;
  end if;
  return next s;
end $$;
grant execute on function public.create_store(text,text,text,text,text,text,text,text,text,text,text,numeric,text) to anon, authenticated;

-- ---------- storage ----------
insert into storage.buckets (id, name, public) values ('store-media','store-media', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('receipts','receipts', false) on conflict do nothing;
create policy "media public read" on storage.objects for select using (bucket_id = 'store-media');
create policy "media owner write" on storage.objects for insert with check (bucket_id = 'store-media' and public.owns_store((storage.foldername(name))[1]::uuid));
create policy "receipts upload on create" on storage.objects for insert with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = 'pending');
create policy "receipts admin read" on storage.objects for select using (bucket_id = 'receipts' and public.is_admin());

-- new auth users get a profile
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin insert into public.profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
