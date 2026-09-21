-- Production migration actually applied to the connected project.
-- Living Skills Lineage is isolated from pre-existing public tables.
create schema if not exists lineage;
-- See docs/DATA_MODEL.md for entity semantics.
-- The live schema contains regions, communities, skills, skill_variants,
-- access_policies, consent_records, practitioners, stories, claims, evidence,
-- practice_relationships, preservation_assessments, tacit_knowledge,
-- nominations, nomination_contacts and editor_roles.
-- All lineage tables have RLS enabled.
-- Public nomination entry is exposed only through public.submit_lineage_nomination().
