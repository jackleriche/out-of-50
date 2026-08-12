"use client";

/**
 * Molecule. The invite list. Read-only once the link is live, since an
 * invite that has already been emailed cannot be un-sent.
 */

type Props = {
  emails: readonly string[];
  readOnly?: boolean;
  onRemove: (email: string) => void;
};

export function EmailChipList({ emails, readOnly = false, onRemove }: Props) {
  if (emails.length === 0) return null;

  return (
    <ul className="chips">
      {emails.map((e) => (
        <li className="chip-static" key={e}>
          <span>{e}</span>
          {!readOnly && (
            <button type="button" aria-label={`Remove ${e}`} onClick={() => onRemove(e)}>
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
