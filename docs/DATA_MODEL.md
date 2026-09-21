# Living Skills Lineage — production data model

The model separates **people, claims, evidence, consent and publication**. A story can be beautiful without making unsupported factual claims.

## Core entities

### Region
`id, country_code, parent_region_id, name, local_names[], coordinates?`

### Community
`id, region_id, name, local_names[], description, community_contact?, permissions_policy_id`

### Skill
`id, community_id?, name, local_names[], category, description, origin_notes, publication_state`

A skill may have regional **variants** rather than forcing several traditions into one canonical record.

### SkillVariant
`id, skill_id, region_id, community_id?, name, local_names[], description`

### Practitioner
`id, display_name, self_description, languages[], region_id, consent_record_id, publication_state`

Birth date, private contact information and legal identity are not public-profile requirements.

### PracticeRelationship
Represents a consented human transmission relationship.

`id, teacher_practitioner_id?, learner_practitioner_id?, teacher_display_text?, skill_variant_id, relationship_type, start_year?, end_year?, claim_id, publication_state`

Relationship types: `teacher, family_transmission, apprenticeship, peer_transmission, community_transmission`.

### Story
`id, practitioner_id, skill_variant_id, title, original_language, original_text/audio/video, translated_versions[], editorial_notes, consent_record_id, publication_state`

Original media is authoritative. Translation is derivative and must carry reviewer/provenance metadata.

### TacitKnowledge
“Someone should know this after me.”

`id, practitioner_id, skill_variant_id, original_language, original_media, transcript?, translations[], access_policy_id, consent_record_id`

### Claim
All consequential factual assertions become claims instead of free text.

`id, subject_type, subject_id, predicate, value, asserted_by, asserted_at, verification_state, last_verified_at?, review_notes?`

Examples: practitioner relationship, years practicing, number of known active practitioners, preservation status.

### Evidence
`id, claim_id, evidence_type, citation_or_reference, captured_at?, source_owner?, reviewer_id?, notes, access_policy_id`

Evidence types may include practitioner testimony, community attestation, field documentation, institutional source, scholarly source, archival source.

### PreservationAssessment
`id, skill_variant_id, status, rationale_claim_ids[], assessor, assessed_at, review_due_at, methodology_version`

Statuses:
- active
- declining
- endangered
- critically_endangered
- last_known_practitioners
- no_known_active_practitioners
- insufficient_evidence

“No known active practitioners” is not the same as “extinct.”

### ConsentRecord
`id, subject_or_representative, captured_at, captured_by, languages_used[], scopes[], revocation_method, notes`

Consent is versioned. Withdrawal does not erase the historical fact that consent once existed, but publication must respect the current consent state.

### AccessPolicy
`id, visibility, learning_permission, commercial_permission, recording_permission, attribution_requirements, community_constraints`

Visibility: `public, community_only, restricted, sacred_private, do_not_document`.

### Nomination
`id, submitted_at, submitter_contact_private, skill_name, region, community?, description, why_at_risk?, practitioner_contact_private?, review_state`

A nomination never becomes a public claim automatically.

## Publication states

`draft → consent_pending → evidence_review → community_review? → publishable → published → needs_reverification → withdrawn`

## Design rule

The public UI reads from publishable records. Raw nominations, private contacts, restricted evidence and non-public knowledge must never be exposed through a public API.
