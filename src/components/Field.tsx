import type { InputHTMLAttributes } from "react";

/** Labelled input with optional hint and inline error, wired with aria attributes. */
export function Field({
  name,
  label,
  hint,
  error,
  ...rest
}: { name: string; label: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errId = error ? `${name}-err` : undefined;
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        className="input"
        aria-invalid={!!error || undefined}
        aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      {hint && (
        <p id={hintId} className="hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="error-text">
          {error}
        </p>
      )}
    </div>
  );
}
