export const preservationStatuses = [
  "active",
  "declining",
  "endangered",
  "critically_endangered",
  "last_known_practitioners",
  "no_known_active_practitioners",
  "insufficient_evidence",
];

export const accessVisibilities = [
  "public",
  "community_only",
  "restricted",
  "sacred_private",
  "do_not_document",
];

export const publicationStates = [
  "draft",
  "consent_pending",
  "evidence_review",
  "community_review",
  "publishable",
  "published",
  "needs_reverification",
  "withdrawn",
];

export const emptyNomination = {
  skillName: "",
  localName: "",
  country: "",
  region: "",
  community: "",
  whyItMatters: "",
  whyAtRisk: "",
  relationship: "",
  contact: "",
  permissionToContact: false,
};

export function validateNomination(value) {
  const errors = {};
  if (!value.skillName.trim()) errors.skillName = "Tell us what the skill is called.";
  if (!value.country.trim()) errors.country = "Add the country or territory.";
  if (!value.region.trim()) errors.region = "Add the region, village or nearest place.";
  if (!value.whyItMatters.trim()) errors.whyItMatters = "Tell us what makes this knowledge worth documenting.";
  if (!value.contact.trim()) errors.contact = "Add a way for the editorial team to follow up.";
  if (!value.permissionToContact) errors.permissionToContact = "We need permission to contact you about this nomination.";
  return errors;
}
