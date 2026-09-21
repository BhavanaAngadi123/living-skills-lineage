-- Living Skills Lineage production foundation
create extension if not exists pgcrypto;

create type public.publication_state as enum ('draft','consent_pending','evidence_review','community_review','publishable','published','needs_reverification','withdrawn');
create type public.preservation_status as enum ('active','declining','endangered','critically_endangered','last_known_practitioners','no_known_active_practitioners','insufficient_evidence');
create type public.verification_state as enum ('unreviewed','in_review','corroborated','disputed','insufficient_evidence');
create type public.access_visibility as enum ('public','community_only','restricted','sacred_private','do_not_document');
create type public.review_state as enum ('submitted','researching','consent','verification','approved','rejected','published');

create table public.regions (
 id uuid primary key default gen_random_uuid(), country_code text not null, parent_region_id uuid references public.regions(id),
 name text not null, local_names jsonb not null default '[]', created_at timestamptz not null default now()
);
create table public.communities (
 id uuid primary key default gen_random_uuid(), region_id uuid references public.regions(id), name text not null,
 local_names jsonb not null default '[]', description text, publication_state public.publication_state not null default 'draft',
 created_at timestamptz not null default now()
);
create table public.skills (
 id uuid primary key default gen_random_uuid(), name text not null, local_names jsonb not null default '[]',
 category text, description text, publication_state public.publication_state not null default 'draft',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.skill_variants (
 id uuid primary key default gen_random_uuid(), skill_id uuid not null references public.skills(id) on delete cascade,
 region_id uuid references public.regions(id), community_id uuid references public.communities(id), name text not null,
 local_names jsonb not null default '[]', description text, publication_state public.publication_state not null default 'draft',
 created_at timestamptz not null default now()
);
create table public.access_policies (
 id uuid primary key default gen_random_uuid(), visibility public.access_visibility not null default 'restricted',
 learning_permission boolean not null default false, commercial_permission boolean not null default false,
 recording_permission boolean not null default false, attribution_requirements text, community_constraints text,
 created_at timestamptz not null default now()
);
create table public.consent_records (
 id uuid primary key default gen_random_uuid(), subject_display_name text not null, captured_at timestamptz not null default now(),
 captured_by uuid references auth.users(id), languages_used text[] not null default '{}', scopes jsonb not null default '[]',
 is_active boolean not null default true, revocation_method text, notes text, created_at timestamptz not null default now()
);
create table public.practitioners (
 id uuid primary key default gen_random_uuid(), display_name text not null, self_description text, languages text[] not null default '{}',
 region_id uuid references public.regions(id), consent_record_id uuid references public.consent_records(id),
 publication_state public.publication_state not null default 'draft', created_at timestamptz not null default now()
);
create table public.stories (
 id uuid primary key default gen_random_uuid(), practitioner_id uuid not null references public.practitioners(id),
 skill_variant_id uuid not null references public.skill_variants(id), title text not null, original_language text not null,
 original_text text, translations jsonb not null default '[]', consent_record_id uuid references public.consent_records(id),
 access_policy_id uuid references public.access_policies(id), publication_state public.publication_state not null default 'draft',
 created_at timestamptz not null default now(), published_at timestamptz
);
create table public.claims (
 id uuid primary key default gen_random_uuid(), subject_type text not null, subject_id uuid not null, predicate text not null,
 value jsonb not null, asserted_by text, asserted_at timestamptz not null default now(),
 verification_state public.verification_state not null default 'unreviewed', last_verified_at timestamptz, review_notes text
);
create table public.evidence (
 id uuid primary key default gen_random_uuid(), claim_id uuid not null references public.claims(id) on delete cascade,
 evidence_type text not null, citation_or_reference text not null, captured_at timestamptz, source_owner text,
 reviewer_id uuid references auth.users(id), notes text, access_policy_id uuid references public.access_policies(id),
 created_at timestamptz not null default now()
);
create table public.practice_relationships (
 id uuid primary key default gen_random_uuid(), teacher_practitioner_id uuid references public.practitioners(id),
 learner_practitioner_id uuid references public.practitioners(id), teacher_display_text text,
 skill_variant_id uuid not null references public.skill_variants(id), relationship_type text not null,
 start_year int, end_year int, claim_id uuid references public.claims(id),
 publication_state public.publication_state not null default 'draft'
);
create table public.preservation_assessments (
 id uuid primary key default gen_random_uuid(), skill_variant_id uuid not null references public.skill_variants(id),
 status public.preservation_status not null default 'insufficient_evidence', rationale_claim_ids uuid[] not null default '{}',
 assessor_id uuid references auth.users(id), assessed_at timestamptz not null default now(), review_due_at timestamptz,
 methodology_version text not null default '1.0', publication_state public.publication_state not null default 'draft'
);
create table public.tacit_knowledge (
 id uuid primary key default gen_random_uuid(), practitioner_id uuid not null references public.practitioners(id),
 skill_variant_id uuid not null references public.skill_variants(id), original_language text not null, original_text text,
 transcript text, translations jsonb not null default '[]', access_policy_id uuid references public.access_policies(id),
 consent_record_id uuid references public.consent_records(id), publication_state public.publication_state not null default 'draft'
);
create table public.nominations (
 id uuid primary key default gen_random_uuid(), submitted_at timestamptz not null default now(), skill_name text not null,
 local_name text, country text not null, region text not null, community text, why_it_matters text not null, why_at_risk text,
 relationship text, review_state public.review_state not null default 'submitted'
);
create table public.nomination_contacts (
 nomination_id uuid primary key references public.nominations(id) on delete cascade, contact text not null,
 permission_to_contact boolean not null default false
);
create table public.editor_roles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('contributor','researcher','reviewer','admin')), created_at timestamptz not null default now()
);

create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.editor_roles where user_id=auth.uid());
$$;
create or replace function public.is_reviewer()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.editor_roles where user_id=auth.uid() and role in ('reviewer','admin'));
$$;

alter table public.regions enable row level security;
alter table public.communities enable row level security;
alter table public.skills enable row level security;
alter table public.skill_variants enable row level security;
alter table public.access_policies enable row level security;
alter table public.consent_records enable row level security;
alter table public.practitioners enable row level security;
alter table public.stories enable row level security;
alter table public.claims enable row level security;
alter table public.evidence enable row level security;
alter table public.practice_relationships enable row level security;
alter table public.preservation_assessments enable row level security;
alter table public.tacit_knowledge enable row level security;
alter table public.nominations enable row level security;
alter table public.nomination_contacts enable row level security;
alter table public.editor_roles enable row level security;

create policy "public published skills" on public.skills for select using (publication_state='published');
create policy "public published variants" on public.skill_variants for select using (publication_state='published');
create policy "public published practitioners" on public.practitioners for select using (publication_state='published');
create policy "public published stories" on public.stories for select using (publication_state='published');
create policy "public published relationships" on public.practice_relationships for select using (publication_state='published');
create policy "public published assessments" on public.preservation_assessments for select using (publication_state='published');
create policy "public published tacit knowledge" on public.tacit_knowledge for select using (publication_state='published');
create policy "public regions" on public.regions for select using (true);
create policy "public published communities" on public.communities for select using (publication_state='published');

create policy "editors manage regions" on public.regions for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage communities" on public.communities for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage skills" on public.skills for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage variants" on public.skill_variants for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage practitioners" on public.practitioners for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage stories" on public.stories for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage relationships" on public.practice_relationships for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage assessments" on public.preservation_assessments for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage tacit" on public.tacit_knowledge for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage policies" on public.access_policies for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage consent" on public.consent_records for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage claims" on public.claims for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage evidence" on public.evidence for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors view nominations" on public.nominations for select to authenticated using (public.is_editor());
create policy "editors update nominations" on public.nominations for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors view contacts" on public.nomination_contacts for select to authenticated using (public.is_editor());
create policy "admins view roles" on public.editor_roles for select to authenticated using (user_id=auth.uid() or public.is_reviewer());

-- Public submissions are handled through a security-definer RPC so contact data never needs table insert grants.
create or replace function public.submit_nomination(
 p_skill_name text,p_local_name text,p_country text,p_region text,p_community text,
 p_why_it_matters text,p_why_at_risk text,p_relationship text,p_contact text,p_permission boolean
) returns uuid language plpgsql security definer set search_path=public as $$
declare n uuid;
begin
 if length(trim(p_skill_name))<2 or length(trim(p_country))<2 or length(trim(p_region))<2 or length(trim(p_why_it_matters))<10 then
   raise exception 'Incomplete nomination';
 end if;
 if not p_permission or length(trim(p_contact))<3 then raise exception 'Contact permission required'; end if;
 insert into public.nominations(skill_name,local_name,country,region,community,why_it_matters,why_at_risk,relationship)
 values(trim(p_skill_name),nullif(trim(p_local_name),''),trim(p_country),trim(p_region),nullif(trim(p_community),''),trim(p_why_it_matters),nullif(trim(p_why_at_risk),''),nullif(trim(p_relationship),''))
 returning id into n;
 insert into public.nomination_contacts(nomination_id,contact,permission_to_contact) values(n,trim(p_contact),true);
 return n;
end $$;
revoke all on function public.submit_nomination(text,text,text,text,text,text,text,text,text,boolean) from public;
grant execute on function public.submit_nomination(text,text,text,text,text,text,text,text,text,boolean) to anon, authenticated;

create index idx_skills_publication on public.skills(publication_state);
create index idx_stories_publication on public.stories(publication_state);
create index idx_nominations_review on public.nominations(review_state,submitted_at desc);
create index idx_claims_subject on public.claims(subject_type,subject_id);
