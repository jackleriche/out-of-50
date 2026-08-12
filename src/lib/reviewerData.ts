/**
 * The reviewer-facing data boundary.
 *
 * Descriptor rows carry the fault mapping — faultName, likelyCause,
 * suggestedFix — which exists for the brewer alone. Reviewers pick plain
 * words; naming the fault to them would suggest it into existence and corrupt
 * the data the app is collecting.
 *
 * Belt and braces: the select clause keeps it out of the query, and the
 * mapper keeps it out of the response even if a caller over-selects.
 */

export const REVIEWER_DESCRIPTOR_SELECT = {
  id: true,
  label: true,
  category: true,
} as const;

export type ReviewerDescriptor = { id: string; label: string; category: string };

export const toReviewerDescriptor = (row: {
  id: string;
  label: string;
  category: string;
}): ReviewerDescriptor => ({ id: row.id, label: row.label, category: row.category });
